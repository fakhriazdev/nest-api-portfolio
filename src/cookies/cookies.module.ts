import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import cookiesConfig from './cookies.config';

@Module({ imports: [ConfigModule.forFeature(cookiesConfig)] })
export class CookiesModule implements NestModule {
  constructor(
    @Inject(cookiesConfig.KEY)
    private readonly config: ConfigType<typeof cookiesConfig>,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(this.config.secret))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
