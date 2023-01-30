import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsEntity } from "./news.entity";

@Module({
  imports:  [TypeOrmModule.forFeature([NewsEntity])],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
