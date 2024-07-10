import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('/bot')
export class BotWebhookController {
  @Get()
  async getBotInfo(): Promise<any> {
    return {
      name: 'BotName',
    };
  }

  @Post()
  async getPostInfo(@Body() body: any): Promise<any> {
    console.log('eso!', body.message);
    return '';
  }
}
