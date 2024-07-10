import { UseFilters, UseInterceptors } from '@nestjs/common';
import * as dayJs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { Context } from 'grammy';
import { Command, Ctx, Update } from '@grammyjs-nest';

import { ResponseTimeInterceptor } from './response-time.interceptor';
import { TelegrafExceptionFilter } from './telegraf-exception.filter';
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

  @Command('partidos')
  async sendTodayMatches(@Ctx() ctx: Context) {
    const { api, chat } = ctx;

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
        await api.sendMessage(chat.id, matchTextList.join('\n\n'), {
          parse_mode: 'MarkdownV2',
          disable_notification: true,
        });
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
