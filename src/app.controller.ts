import { Controller, Get } from '@nestjs/common';
import { env } from 'node:process';

@Controller('/')
export class AppController {
  @Get()
  async getAppInfo(): Promise<any> {
    return {
      appName: env.npm_package_name,
      version: env.npm_package_version,
    };
  }
}
