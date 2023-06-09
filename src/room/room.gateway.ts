import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';
import { SavingPosition } from './room.service';

type ActiveSocketType = {
  room: String;
  id: string;
  userId: string;
}

<<<<<<< Updated upstream
@WebSocketGateway({cors: true})
=======
@WebSocketGateway({ cors: true })
>>>>>>> Stashed changes
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly service: RoomService) { }

  @WebSocketServer() wss: Server;

  private logger = new Logger(RoomGateway.name);
<<<<<<< Updated upstream
  private activeSockets: ActiveSocketType[]= [];

  
  afterInit(server: any) {
    this.logger.log('Gateway initialized')
  }
=======
  private activeSockets: ActiveSocketType[] = [];
>>>>>>> Stashed changes

  async handleDisconnect(client: any) {
    const existingOnSocket = this.activeSockets.find(
      socket => socket.id === client.id
    );

    if (!existingOnSocket) return;

    this.activeSockets = this.activeSockets.filter(
      socket => socket.id !== client.id
    );

<<<<<<< Updated upstream
    const savingPosition = await SavingPosition{
      link,
      x,
      y,
      orientation
    };

    this.create()

    await this.service.deleteUserPosition(client.id);
=======
    await this.service.deleteUsersPosition(client.id);
    client.broadcast.emit(`${existingOnSocket.room}-remove-user`, { socketId: client.id });
>>>>>>> Stashed changes

    this.logger.debug(`Client: ${client.id} disconnected`);
  }

  afterInit(server: any) {
    this.logger.log('Gateway initialized');
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: JoinRoomDto) {
    const { link, userId } = payload;

<<<<<<< Updated upstream
    const existingOnSockets = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id);
    
      if(!existingOnSockets){
        this.activeSockets.push({room:link, id:client.id, userId});

        const dto = {
          link,
          userId,
          x:2,
          y:2,
          orientation:'down'
        } as UpdateUserPositionDto

        await this.service.updateUserPosition(client.id, dto);
        const users = await this.service.listUserPositionByLink(link);
        this.wss.emit(`${link}-update-user-list`,{users});
        client.broadcast.emit(`${link}-add-user`, {user:client.id});
      }
=======
    const existingOnSocket = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id);
>>>>>>> Stashed changes

    if (!existingOnSocket) {
      this.activeSockets.push({ room: link, id: client.id, userId });

      const dto = {
        link,
        userId,
        x: 1,
        y: 1,
        orientation: 'front'
      } as UpdateUserPositionDto

      await this.service.updateUserPosition(client.id, dto);

    }

    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });

    if (!existingOnSocket) {
      client.broadcast.emit(`${link}-add-user`, { user: client.id });
    }

    this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
  }

  @SubscribeMessage('move')
  async handleMove(client: Socket, payload: UpdateUserPositionDto) {
    const { link, userId, x, y, orientation } = payload;
    const dto = {
      link,
      userId,
      x,
      y,
      orientation
    } as UpdateUserPositionDto

    await this.service.updateUserPosition(client.id, dto);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });
  }

  @SubscribeMessage('toggl-mute-user')
  async handleToglMute(_: Socket, payload: ToglMuteDto) {
    const { link } = payload;
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });
  }

  @SubscribeMessage('call-user')
  async callUser(client: Socket, data: any) {
    this.logger.debug(`callUser: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id
    });
  }

  @SubscribeMessage('make-answer')
  async makeAnswer(client: Socket, data: any) {
    this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('answer-made', {
      answer: data.answer,
      socket: client.id
    });
  }
}
