import { Body, Controller, Get, HttpCode, HttpStatus, Put, Request } from '@nestjs/common'
import { HistoryService } from './history.service';
import { History, HistoryDocument } from './schema/history.schema';
import { HistoryDto } from './dtos/history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('history')
export class HistoryController {
    constructor(
        @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
        private readonly historyService: HistoryService){}

    @Get()
    async getHistory(@Request() req){
        const {userId} = req?.user;
        const result = await this.historyService.getHistoryByUserId(userId);

        if(!result){
            return {
                x:2,
                y:2,
                orientation:'down'
            }
        }else{
            // return result.map(m => ({
            //     userId: m._id,
            //     link:m.link,
            //     x : m.x,
            //     y:m.y,
            //     orientation:m.orientation
            // }) as HistoryDto);
        }
    }

}
