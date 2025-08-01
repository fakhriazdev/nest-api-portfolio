import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // ⬅️ Penting: ConfigModule harus di-import agar dotenv dijalankan
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRES,       // contoh: '1d'
        issuer: process.env.ISSUER_STAMP,     // contoh: 'myapp.com'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
