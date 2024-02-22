import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT = 4002;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('pdf example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  Logger.log(`http://127.0.0.1:${PORT}/api`);
}
bootstrap();
