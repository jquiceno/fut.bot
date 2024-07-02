import { UseFilters, UseInterceptors } from "@nestjs/common";
import { Update, Command, Ctx, Action } from "nestjs-telegraf";
import { EchoService } from "./bot.service";
import { ResponseTimeInterceptor } from "./response-time.interceptor";
import { TelegrafExceptionFilter } from "./telegraf-exception.filter";
import * as countryFlagEmoji from "country-flag-emoji";
import { Scenes } from "telegraf";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import * as dayJs from "dayjs";
import { ApiService } from "./api.service";

const tz = "America/Bogota";

dayJs.extend(utc);
dayJs.extend(timezone);

function getCountryFlag(name: string) {
  const flagsMap = countryFlagEmoji.list;

  if (name.toLowerCase() === "england") {
    name = "United Kingdom";
  }

  if (name.toLowerCase() === "usa") {
    name = "United States";
  }

  const [flag] = flagsMap.filter((item) => {
    return item.name.toLowerCase().includes(name.toLowerCase());
  });

  return flag ? flag.emoji : "";
}

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class UpdateEvents {
  constructor(private readonly apiService: ApiService) {}

  @Command("adivine")
  async sendPredictions(@Ctx() ctx: Scenes.SceneContext) {
    const { telegram, chat } = ctx;

    const matches = await this.apiService.getTodayMatches(["4", "9"]);

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

    telegram.sendMessage(chat.id, "Selecciona el partido: ⚽️", {
      reply_markup: {
        inline_keyboard: [...matchesButtons],
      },
    });

    return null;
  }

  @Action(/^match:/)
  async onMatchPredictionSelected(@Ctx() ctx: any) {
    ctx.deleteMessage();

    const { update } = ctx;

    const matchId = update.callback_query.data.split(":")[1];
    const { predictions } = await this.apiService.getMatchPrediction(matchId);

    let predictionText = "Gana";

    if (predictions.win_or_draw) {
      predictionText = "Gana o empata";
    }

    const messageLines = [
      `${predictionText} ${predictions.winner.name} ${getCountryFlag(predictions.winner.name)}`,
    ];

    if (predictions.under_over) {
      messageLines.push(`Hay ${predictions.under_over} goles ⚽️`);
    }

    return messageLines.join("\n");
  }

  @Command("partidos")
  async sendTodayMatches(@Ctx() ctx: Scenes.SceneContext) {
    const { telegram, chat } = ctx;
    const matches = await this.apiService.getTodayMatches(["4", "9"]);

    const matchTextList = [];

    for (const match of matches) {
      const { teams, fixture, goals } = match;

      const homeTitle = `${getCountryFlag(teams.home.name)} ${teams.home.name} ${this.getResultText(goals.home)}`;
      const awayTitle = `${teams.away.name} ${this.getResultText(goals.away)} ${getCountryFlag(teams.away.name)}`;

      matchTextList.push(
        `${homeTitle} VS ${awayTitle} \n${this.getTimeMatch(fixture)}`,
      );
      // telegram.sendMessage(chat.id, `${homeTitle} VS ${awayTitle} (${fixture.status.short}) \n ${timeMatch}`)
    }

    await telegram.sendMessage(chat.id, matchTextList.join("\n\n"), {
      parse_mode: "MarkdownV2",
    });

    return null;
  }

  getTimeMatch(match: any) {
    const { status } = match;
    const timeMatch = dayJs(match.date).tz(tz).format("h:mm a");

    return `${status.short} \\- ${timeMatch}`;
  }

  getResultText(goals) {
    if (!goals) return "";

    return `\\(*${goals}*\\)`;
  }
}
