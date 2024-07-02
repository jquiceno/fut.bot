import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class AppController {
  @Get()
  getAppInfo(): any {
    return {
      appName: "fut.bot",
      version: "0.0.1",
    };
  }
}
