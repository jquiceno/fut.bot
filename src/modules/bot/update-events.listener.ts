import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Context } from 'grammy';
import { Command, Ctx, Update } from '@grammyjs-nest';

import { ResponseTimeInterceptor } from './response-time.interceptor';
import { ApiService } from './api.service';
import { getCountryFlag, getTzDate } from './utils';
import { GrammyExceptionFilter } from './filters';

const tz = 'America/Bogota';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class UpdateEvents {
  constructor(private readonly apiService: ApiService) {}

  @Command('partidos')
  async sendTodayMatches(@Ctx() ctx: Context) {
    const { api, chat } = ctx;

    const leagues = ['4', '9'];

    for (const leagueId of leagues) {
      const matches = await this.apiService.getTodayMatches(leagueId);

      if (!matches.length) {
        return ctx.reply('🧑🏾‍🦯‍➡️ No hay partidos para hoy');
      }

      const matchTextList = [];

      for (const match of matches) {
        const { teams, fixture, goals } = match;

        const homeTitle = `${getCountryFlag(teams.home.name)} ${teams.home.name} ${this.getResultText(goals.home)}`;
        const awayTitle = `${teams.away.name} ${this.getResultText(goals.away)} ${getCountryFlag(teams.away.name)}`;

        matchTextList.push(`${homeTitle} VS ${awayTitle} ${this.getTimeMatch(fixture, tz)}`);
      }

      if (matchTextList.length) {
        await api.sendMessage(chat.id, matchTextList.join('\n\n'), {
          parse_mode: 'MarkdownV2',
          disable_notification: true,
        });
      }
    }

    return null;
  }

  getTimeMatch(match: any, tz: string) {
    const timeMatch = getTzDate(match.timestamp.toDate(), tz).format('h:mm a');

    return `\\- ${timeMatch}`;
  }

  getResultText(goals) {
    if (!goals) return '';

    return `\\(*${goals}*\\)`;
  }
}
