import { Context, InlineKeyboard } from 'grammy';
import { CallbackQuery, Command, Ctx, Update } from '@grammyjs-nest';

import { ApiService } from '../api.service';
import { getCountryFlag } from '../utils';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../interceptors';
import { GrammyExceptionFilter } from '../filters';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class MatchPredictionScene {
  constructor(private readonly apiService: ApiService) {}

  @Command('adivine')
  async onCallPredictions(@Ctx() ctx: Context & { session: any }): Promise<string> {
    const leagues = ['239', '2'];
    const matchesButtons = new InlineKeyboard();

    for (const leagueId of leagues) {
      const matches = await this.apiService.getTodayMatches(leagueId);

      for (const match of matches) {
        const { teams, fixture } = match;
        const homeTitle = `${getCountryFlag(teams.home.name)} ${teams.home.name}`;
        const awayTitle = `${teams.away.name} ${getCountryFlag(teams.away.name)}`;

        matchesButtons.text(`${homeTitle} VS ${awayTitle}`, `match:${fixture.id}`).row();
      }
    }

    await ctx.reply('Selecciona el partido: ⚽️', {
      reply_markup: matchesButtons,
    });

    ctx.session['matchesSelected'] = {};
    ctx.session['buttons'] = matchesButtons.inline_keyboard;

    return null;
  }

  @CallbackQuery(/^match:/)
  async onMatchSelected(@Ctx() ctx: Context & { session: any }) {
    const { callback_query } = ctx.update;

    const query = callback_query.data;

    const selectedButtons = ctx.session['matchesSelected'];
    const buttons = ctx.session['buttons'];

    selectedButtons[query] = !selectedButtons[query];

    const newB = new InlineKeyboard();

    for (const b of buttons) {
      if (!b.length) continue;

      const { callback_data, text } = b[0];

      let newText = text;

      if (selectedButtons[callback_data]) {
        newText = `✅ ${text}`;
      }

      newB.text(newText, callback_data).row();
    }

    const isSelected = Object.values(selectedButtons).find((value) => {
      if (value) return value;
    });

    if (isSelected) {
      newB.text('Enviar', 'predictions');
    }

    return ctx.editMessageReplyMarkup({
      reply_markup: newB,
    });
  }

  @CallbackQuery('predictions')
  async createPredictions(@Ctx() ctx: Context & { session: any }) {
    const matchIdList = Object.keys(ctx.session['matchesSelected']).map((key: string) => key.split(':')[1]);

    const predictions = await this.apiService.getMatchPrediction(matchIdList);

    let messageDeleted = false;

    for (const prediction of predictions) {
      let predictionText = 'Gana';

      if (prediction.win_or_draw) {
        predictionText = 'Gana o empata';
      }

      const messageLines = [`${predictionText} ${prediction.winner.name} ${getCountryFlag(prediction.winner.name)}`];

      if (prediction.under_over) {
        messageLines.push(`Hay ${prediction.under_over} goles ⚽️`);
      }

      if (!messageDeleted) {
        ctx.deleteMessage();
        messageDeleted = true;
      }

      await ctx.reply(messageLines.join('\n'));
    }

    ctx.session = {};
    return null;
  }
}
