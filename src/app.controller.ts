import { Controller, Get } from '@nestjs/common';
import * as pkg from '../package.json';

@Controller('/')
export class AppController {
  @Get()
  async getAppInfo(): Promise<any> {
    return {
      appName: pkg.name,
      version: pkg.version,
    };
  }
}
