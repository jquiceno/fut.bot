import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Context } from 'grammy';
import { Command, Ctx, Update } from '@grammyjs-nest';
import { Firestore } from 'firebase-admin/firestore';

import { ResponseTimeInterceptor } from './response-time.interceptor';
import { ApiService } from './api.service';
import { getCountryFlag, getTzDate } from './utils';
import { GrammyExceptionFilter } from './filters';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class UpdateEvents {
  private readonly chats: FirebaseFirestore.CollectionReference;

  constructor(
    private readonly apiService: ApiService,
    private readonly firestore: Firestore,
  ) {
    this.chats = firestore.collection('chats');
  }

  @Command('partidos')
  async sendTodayMatches(@Ctx() ctx: Context) {
    const { api, chat } = ctx;

    const docRef = await this.chats.doc(String(chat.id)).get();

    const chatData = docRef.data();

    const leagues = ['239', '2'];

    let totalMatches = 0;

    for (const leagueId of leagues) {
      const matches = await this.apiService.getTodayMatches(leagueId, chatData.timeZone);

      totalMatches += matches.length;

      const matchTextList = [];

      for (const match of matches) {
        const { teams, fixture, goals } = match;

        const homeTitle = `${this.getResultText(goals.home)} ${getCountryFlag(teams.home.name)} ${teams.home.name}`;
        const awayTitle = `${this.getResultText(goals.away)} ${getCountryFlag(teams.away.name)} ${teams.away.name}`;

        matchTextList.push(`${this.getTimeMatch(fixture, chatData.timeZone)}\n${homeTitle}\n${awayTitle}`);
      }

      if (matchTextList.length) {
        await api.sendMessage(chat.id, matchTextList.join('\n\n'), {
          parse_mode: 'MarkdownV2',
          disable_notification: true,
        });
      }
    }

    if (!totalMatches) {
      return ctx.reply('🧑🏾‍🦯‍➡️ No hay partidos para hoy');
    }

    return null;
  }

  getTimeMatch(match: any, tz: string) {
    const timeMatch = getTzDate(tz, match.timestamp.toDate()).format('h:mm a');

    return `${timeMatch}`;
  }

  getResultText(goals) {
    if (!goals && goals !== 0) return '';

    return `\\(*${goals}*\\)`;
  }
}
