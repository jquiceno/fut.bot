import { registerAs } from "@nestjs/config";

export const configuration = registerAs("GLOBAL_CONFIG", () => {
  return {
    //App
    NODE_ENV: process.env.NODE_ENV || "dev",
    PORT: parseInt(process.env.PORT, 10),

    // Telegram
    TELEGRAM_BOT_KEY: process.env.TELEGRAM_BOT_KEY,

    //Providers
    API_FOOTBALL_KEY: process.env.API_FOOTBALL_KEY,
    API_FOOTBALL_HOST: process.env.API_FOOTBALL_HOST,
  };
});
