import { Admin, CallbackQuery, Ctx, Hears, Help, InjectBot, Message, Start, Update } from '@grammyjs-nest';
import { Logger, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Bot, Context, InlineKeyboard } from 'grammy';
import { AdminGuard } from './guards';
import { ResponseTimeInterceptor } from './interceptors';
import { GrammyExceptionFilter } from './filters';
import { ReverseTextPipe } from './pipes';

const logger = new Logger('bot:firebase-bot.update');

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class WebhookUpdater {
  private readonly inlineKeyboard: InlineKeyboard;

  constructor(
    @InjectBot('DonEdgarBot')
    private readonly bot: Bot<Context>,
  ) {
    this.inlineKeyboard = new InlineKeyboard().text('click', 'click-payload');
  }

  @Start()
  async onStart(@Ctx() ctx: Context & { session: any }) {
    logger.log('onStart!!', this.bot ? this.bot.botInfo.first_name : '(booting)');

    ctx.session.data = {
      step: 1,
    };

    return ctx.reply('Curious? Click me!', {
      reply_markup: this.inlineKeyboard,
    });
  }

  @CallbackQuery('click-payload')
  async onCallback(@Ctx() ctx: Context & { session: any }) {
    return ctx.answerCallbackQuery({
      text: 'You were curious, indeed!',
    });
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    return ctx.reply('Send me any text');
  }

  @Admin()
  @UseGuards(AdminGuard)
  async onAdminCommand(@Ctx() ctx: Context) {
    return ctx.reply('Welcome, Judge');
  }

  @Hears('greetings')
  async onMessage(@Ctx() ctx: Context, @Message('text', new ReverseTextPipe()) reversedText: string) {
    return ctx.reply(reversedText);
  }
}
