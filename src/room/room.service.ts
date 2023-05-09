import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schemas';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobjects.schema';
import { Position, PositionDocument } from './schemas/position.schema';
import { UserService } from 'src/user/user.service';
import { RoomMessagesHelper } from './helper/roommessages.helper';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';
import { HistoryService } from 'src/history/history.service';
import { HistoryDocument } from 'src/history/schema/history.schema';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);

    constructor(
        @InjectModel(Meet.name) private readonly meetModel : Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel : Model<MeetObjectDocument>,
        @InjectModel(Position.name) private readonly positionModel : Model<PositionDocument>,
        private readonly userService:UserService,
    ){}

    async getRoom(link: string){
        this.logger.debug(`getRoom - ${link}`);

        const meet = await this._getMeet(link);
        const objects = await this.objectModel.find({meet});
        
            return {
                link, 
                name: meet.name,
                color: meet.color,
                objects
            };
    }

    async listUserPositionByLink(link:string){
        this.logger.debug(`listUserPositionByLink - ${link}`);

        const meet = await this._getMeet(link);
        return await this.positionModel.find({meet});
    }
    
    async deleteUserPosition(clientId:string){
        this.logger.debug(`deleteUserPosition - ${clientId}`);
        return await this.positionModel.deleteMany({clientId});
    }   

    async updateUserPosition(clientId:string, dto: UpdateUserPositionDto){
        this.logger.debug(`listUserPositionByLink - ${dto.link}`);
        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserById(dto.userId);
        if(!user){
            throw new BadRequestException(RoomMessagesHelper.JOIN_USER_NOT_VALID);
        }
        const position ={
            ...dto,
            clientId,
            user,
            meet,
            name:user.name,
            avatar:user.avatar
        }

        const usersInRoom = await this.positionModel.find({meet});
        if(usersInRoom && usersInRoom.length>10){
            throw new BadRequestException(RoomMessagesHelper.ROOM_MAX_USERS)
        }

        const loggedUserInRoom = usersInRoom.find(u => 
            u.user.toString() == user._id.toString() || u.clientId === clientId);
        if(loggedUserInRoom){
            await this.positionModel.findByIdAndUpdate({_id: loggedUserInRoom._id},position);
        }else{
            await this.positionModel.create(position);
        }
    }

    async updateUserMute(dto:ToglMuteDto){
        this.logger.debug(`updateUserMute - ${dto.link} - ${dto.userId}`);
        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserById(dto.userId);
        await this.positionModel.updateMany({user,meet},{muted:dto.muted})
    }

    async _getMeet(link:string){
        const meet = await this.meetModel.findOne({ link });
        if(!meet){
            throw new BadRequestException(RoomMessagesHelper.JOIN_LINK_NOT_VALID);
        }
        return meet;
    }

    
}
