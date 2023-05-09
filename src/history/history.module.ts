import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './schema/history.schema';

@Module({
  imports: [MongooseModule.forFeature([{name :History.name, schema : HistorySchema}])],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [MongooseModule, HistoryService]
})
export class HistoryModule {}
