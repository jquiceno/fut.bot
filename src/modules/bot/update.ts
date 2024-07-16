import { Logger, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Admin, CallbackQuery, Command, Ctx, Hears, Help, InjectBot, Message, Start, Update } from '@grammyjs-nest';
import { Firestore } from 'firebase-admin/firestore';
import { Bot, Context, InlineKeyboard } from 'grammy';
import { AdminGuard } from './guards';
import { ResponseTimeInterceptor } from './interceptors';
import { GrammyExceptionFilter } from './filters';
import { ReverseTextPipe } from './pipes';
import { Message as Msg } from '@grammyjs/types';
import LocationMessage = Msg.LocationMessage;
import { getCountryTimeZone } from './utils';

const logger = new Logger('bot:firebase-bot.update');

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(GrammyExceptionFilter)
export class WebhookUpdater {
  private readonly inlineKeyboard: InlineKeyboard;
  private readonly chats: FirebaseFirestore.CollectionReference;

  constructor(
    @InjectBot('DonEdgarBot')
    private readonly bot: Bot<Context>,
    private readonly firestore: Firestore,
  ) {
    this.inlineKeyboard = new InlineKeyboard().text('click', 'click-payload');
    this.chats = firestore.collection('chats');
  }

  @Start()
  async onStart(@Ctx() ctx: Context & { session: any }) {
    logger.log('onStart!!', this.bot ? this.bot.botInfo.first_name : '(booting)');

    const { type } = ctx.chat;

    if (!['group', 'supergroup'].includes(type)) {
      await ctx.api.setChatMenuButton({
        chat_id: ctx.chatId,
        menu_button: {
          type: 'commands',
        },
      });
    }

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

  @Command(['settimezone'])
  async onLocation(@Ctx() ctx: Context) {
    if (!ctx.match || typeof ctx.match != 'string') {
      return ctx.reply(
        'Para configurar tu zona horaria envia el comando /settimezone seguido del nombre de tu país:\n<pre>/settimezone Colombia</pre>',
        {
          parse_mode: 'HTML',
        },
      );
    }

    const countryTimeZone = getCountryTimeZone(ctx.match);

    if (!countryTimeZone) return ctx.api.sendMessage(ctx.chatId, 'El nombre del país es invalido');

    const { id } = ctx.chat;

    const docRef = this.chats.doc(String(id));

    await docRef.set({ ...ctx.chat, timeZone: countryTimeZone, id });

    return ctx.reply(`Se configuró ${countryTimeZone} como zona horaria en este chat`);
  }
}
