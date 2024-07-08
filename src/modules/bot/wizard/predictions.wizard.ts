import { Action, Ctx, Wizard, WizardStep, Sender } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { ApiService } from '../api.service';
import { getCountryFlag } from '../utils';

@Wizard('MATCH_PREDICTIONS_SCENE_ID')
export class MatchPredictionsWizard {
  constructor(private readonly apiService: ApiService) {}

  @WizardStep(1)
  async onCallPredictions(@Ctx() ctx: WizardContext, @Sender() sender: any): Promise<string> {
    const { telegram, chat } = ctx;

    console.log('sender', sender);

    const matches = await this.apiService.getTodayMatches(['4', '9']);

    const matchesButtons = [];

    for (const match of matches) {
      const { teams, fixture } = match;
      const homeTitle = `${getCountryFlag(teams.home.name)} ${teams.home.name}`;
      const awayTitle = `${teams.away.name} ${getCountryFlag(teams.away.name)}`;

      matchesButtons.push([
        {
          text: `${homeTitle} VS ${awayTitle}`,
          callback_data: `match:${fixture.id}`,
        },
      ]);
    }

    await telegram.sendMessage(chat.id, 'Selecciona el partido: ⚽️', {
      reply_markup: {
        inline_keyboard: [...matchesButtons],
      },
    });

    ctx.wizard.state['matchesSelected'] = {};
    ctx.wizard.state['buttons'] = matchesButtons;

    await ctx.wizard.next();
    return null;
  }

  @WizardStep(2)
  @Action(/^match:/)
  async onMatchSelected(@Ctx() ctx: WizardContext): Promise<string> {
    const update = ctx.update as any;

    const { callback_query } = update;

    const query = callback_query.data;

    const selectedButtons = ctx.wizard.state['matchesSelected'];
    const buttons = ctx.wizard.state['buttons'];

    selectedButtons[query] = !selectedButtons[query];

    const newB = [];

    for (const b of buttons) {
      const { callback_data, text } = b[0];

      let newText = text;

      if (selectedButtons[callback_data]) {
        newText = `✅ ${text}`;
      }

      newB.push([{ ...b[0], text: newText }]);
    }

    const isSelected = Object.values(selectedButtons).find((value) => {
      if (value) return value;
    });

    if (isSelected) {
      newB.push([{ text: 'Enviar', callback_data: 'predictions' }]);
    }

    await ctx.editMessageReplyMarkup({
      inline_keyboard: [...newB],
    });

    return null;
  }

  @Action('predictions')
  async createPredictions(@Ctx() ctx: WizardContext & { wizard: { state: { name: string } } }) {
    const matchIdList = Object.keys(ctx.wizard.state['matchesSelected']).map((key: string) => key.split(':')[1]);

    const predictions = await this.apiService.getMatchPrediction(matchIdList);

    await ctx.deleteMessage();

    for (const prediction of predictions) {
      let predictionText = 'Gana';

      if (prediction.win_or_draw) {
        predictionText = 'Gana o empata';
      }

      const messageLines = [`${predictionText} ${prediction.winner.name} ${getCountryFlag(prediction.winner.name)}`];

      if (prediction.under_over) {
        messageLines.push(`Hay ${prediction.under_over} goles ⚽️`);
      }

      await ctx.reply(messageLines.join('\n'));
    }

    await ctx.scene.leave();
    return null;
  }
}
