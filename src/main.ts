import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class validator 세팅
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipUndefinedProperties: true,
    }),
  );

  // swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('KUGODS Server')
    .setDescription('KUGODS API description')
    .setVersion('1.0')
    .addTag('KUGODS')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
