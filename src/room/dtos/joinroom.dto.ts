import { IsNotEmpty, isNotEmpty } from "class-validator";
import { RoomMessagesHelper } from "../helper/roommessages.helper";

export class JoinRoomDto{

    @IsNotEmpty({message: RoomMessagesHelper.JOIN_USER_NOT_VALID})
    userId:string;

    @IsNotEmpty({message:RoomMessagesHelper.JOIN_LINK_NOT_VALID})
    link:string;
}