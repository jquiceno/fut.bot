import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as Services from './services';
import { API_CONFIG_PROVIDER_KEY, CLIENT_INSTANCE_PROVIDER_KEY } from './constants';
import { ApiFootBallClientConfig, ApiFootBallModuleOptionsAsync } from './interfaces';
import axios from 'axios';

@Module({})
export class ApiFootBallModule {
  static registerAsync(options: ApiFootBallModuleOptionsAsync): DynamicModule {
    const { global = false } = options;
    return {
      module: ApiFootBallModule,
      global,
      providers: [...Object.values(Services), this.getConfigProvider(options), this.getInstanceProvider()],
      exports: [...Object.values(Services), API_CONFIG_PROVIDER_KEY],
    };
  }

  static getConfigProvider(options: ApiFootBallModuleOptionsAsync): Provider {
    return {
      provide: API_CONFIG_PROVIDER_KEY,
      useFactory: (...services) => options.useFactory(...services),
      inject: [...options.inject],
    };
  }

  static getInstanceProvider(): Provider {
    return {
      provide: CLIENT_INSTANCE_PROVIDER_KEY,
      inject: [API_CONFIG_PROVIDER_KEY],
      useFactory: (config: ApiFootBallClientConfig) => {
        return axios.create({
          method: 'get',
          baseURL: 'https://api-football-v1.p.rapidapi.com/v3/',
          headers: {
            'x-rapidapi-key': config.key,
            'x-rapidapi-host': config.host,
          },
        });
      },
    };
  }
}
