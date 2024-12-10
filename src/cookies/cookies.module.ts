import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as fastifyCookie from '@fastify/cookie';
import cookiesConfig from './cookies.config';

@Module({ imports: [ConfigModule.forFeature(cookiesConfig)] })
export class CookiesModule implements NestModule {
  constructor(
    @Inject(cookiesConfig.KEY)
    private readonly config: ConfigType<typeof cookiesConfig>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    // Di sini tidak perlu ada kode untuk NestFactory atau AppModule
    // Cukup pastikan fastify-cookie sudah didaftarkan di main.ts
  }
}
