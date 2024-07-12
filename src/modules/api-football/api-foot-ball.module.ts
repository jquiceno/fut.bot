import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as Services from './services';
import { API_CONFIG_PROVIDER_KEY } from './constants';
import { ApiFootBallModuleOptionsAsync } from './interfaces';

@Module({})
export class ApiFootBallModule {
  static registerAsync(options: ApiFootBallModuleOptionsAsync): DynamicModule {
    const { global = false } = options;
    return {
      module: ApiFootBallModule,
      global,
      providers: [...Object.values(Services), this.getConfigProvider(options)],
      exports: [...Object.values(Services)],
    };
  }

  static getConfigProvider(options: ApiFootBallModuleOptionsAsync): Provider {
    return {
      provide: API_CONFIG_PROVIDER_KEY,
      useFactory: (...services) => options.useFactory(...services),
      inject: [...options.inject],
    };
  }
}
