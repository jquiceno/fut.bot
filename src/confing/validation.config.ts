import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('dev', 'production', 'test'),
  PORT: Joi.number().default(6666),

  // Telegram
  TELEGRAM_BOT_KEY: Joi.string().required(),
  TELEGRAM_WEBHOOK_URL: Joi.string().required(),

  // Providers
  API_FOOTBALL_KEY: Joi.string().required(),
  API_FOOTBALL_HOST: Joi.string().required(),

  //Firestore
  FIRESTORE_PROJECT_ID: Joi.string().required(),
  FIRESTORE_PRIVATE_KEY: Joi.string(),
  FIRESTORE_CLIENT_EMAIL: Joi.string().required(),
});
