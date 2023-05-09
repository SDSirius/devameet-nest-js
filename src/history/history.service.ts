import { Injectable,  Logger } from '@nestjs/common';
import { History, HistoryDocument } from './schema/history.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryDto } from './dtos/history.dto'

@Injectable()
export class HistoryService {
    private readonly logger = new Logger(HistoryService.name);

    constructor(
        @InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

        async create(dto: HistoryDto) {
            const createdHistory = new this.historyModel(dto);
            return createdHistory.save();
        }

        async getHistoryByUserId(userId:string){
            return await this.historyModel.findById(userId);
           }
}