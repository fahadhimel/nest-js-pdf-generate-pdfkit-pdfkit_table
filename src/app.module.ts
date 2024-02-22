import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppService2 } from './app2.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppService2],
})
export class AppModule {}
