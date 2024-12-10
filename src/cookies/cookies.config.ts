import { registerAs } from '@nestjs/config';

export default registerAs('cookies', () => ({
  secret: process.env.SECRET_KEY || 'your-secret-key', // pastikan secret ada
}));
