import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { Update, Command, Ctx } from 'nestjs-telegraf';

import { ResponseTimeInterceptor } from './response-time.interceptor';
import { TelegrafExceptionFilter } from './telegraf-exception.filter';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayJs from 'dayjs';
import { ApiService } from './api.service';
import { getCountryFlag } from './utils';

const tz = 'America/Bogota';

dayJs.extend(utc);
dayJs.extend(timezone);

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class UpdateEvents {
  constructor(private readonly apiService: ApiService) {}

  @Command('adivine')
  async sendPredictions(@Ctx() ctx: Scenes.SceneContext) {
    return await ctx.scene.enter('MATCH_PREDICTIONS_SCENE_ID');
  }

  @Command('partidos')
  async sendTodayMatches(@Ctx() ctx: Scenes.SceneContext) {
    const { telegram, chat } = ctx;

    const leagues = ['4', '9'];

    for (const leagueId of leagues) {
      const matches = await this.apiService.getTodayMatches(leagueId);

      const matchTextList = [];

      for (const match of matches) {
        const { teams, fixture, goals } = match;

        const homeTitle = `${getCountryFlag(teams.home.name)} ${teams.home.name} ${this.getResultText(goals.home)}`;
        const awayTitle = `${teams.away.name} ${this.getResultText(goals.away)} ${getCountryFlag(teams.away.name)}`;

        matchTextList.push(`${homeTitle} VS ${awayTitle} \n${this.getTimeMatch(fixture)}`);
      }

      if (matchTextList.length) {
        const message = await telegram.sendMessage(chat.id, matchTextList.join('\n\n'), {
          parse_mode: 'MarkdownV2',
          disable_notification: true,
        });

        console.log('message', message);
      }
    }

    return;
  }

  getTimeMatch(match: any) {
    const { status } = match;
    const timeMatch = dayJs(match.date).tz(tz).format('h:mm a');

    return `${status.short} \\- ${timeMatch}`;
  }

  getResultText(goals) {
    if (!goals) return '';

    return `\\(*${goals}*\\)`;
  }
}
