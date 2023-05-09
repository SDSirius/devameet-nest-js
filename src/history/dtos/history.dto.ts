import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { MeetMessagesHelper } from "src/meet/helpers/meetmessages.helper";
import { RoomMessagesHelper } from "src/room/helper/roommessages.helper";

export class HistoryDto {

    @IsNotEmpty({message: RoomMessagesHelper.JOIN_USER_NOT_VALID})
    userId:string;

    @IsNotEmpty({message:RoomMessagesHelper.JOIN_LINK_NOT_VALID})
    link:string;

    @IsNumber({},{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    x:number;
    
    @IsNumber({},{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message: MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    y:number;
    
    @IsString({message: MeetMessagesHelper.UPDATE_ORIENTATION_NOT_VALID})
    orientation:string;
}