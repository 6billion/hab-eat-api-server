import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3000;

  configService.getOrThrow('NODE_ENV') !== 'production' && useSwagger(app);

  app.enableShutdownHooks();
  await app.listen(port);
  return { port, data: new Date() };
}
bootstrap().then(console.log).catch(console.log);
