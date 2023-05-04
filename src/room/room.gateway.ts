import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';

type ActiveSocketType = {
  room:String; 
  id:string; 
  userId:String;
}

async function LoadHistory(userId:string) {
  
  
}

@WebSocketGateway({cors: true})
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly service:RoomService){}

  @WebSocketServer() wss: Server;

  private logger = new Logger(RoomGateway.name);
  private activeSockets: ActiveSocketType[]= []; // source de informações da room REQUIRED
    
  afterInit(server: any) {
    this.logger.log('Gateway initialized'); // Carregar o histórico de todas as rooms que o usuario entrou
  }

  async handleDisconnect(client: any) {
    const existingOnSockets = this.activeSockets.find(
      socket => socket.id === client.id
    );

    if (!existingOnSockets) return;

    this.activeSockets = this.activeSockets.filter(
      socket => socket.id !== client.id
    );

    await this.service.deleteUserPosition(client.id);

    client.broadcast.emit(`${existingOnSockets.room}-remove-user`, {socketId:client.id });

    this.logger.debug(`Client: ${client.id} disconnected`)
  }

  @SubscribeMessage('join')
  async handleJoin(client:Socket, payload:JoinRoomDto){
    const {link, userId}= payload;

    const standardPosition = {
      link,
      userId,
      x:2,
      y:2,
      orientation:'down'
    }
    

    const existingOnSockets = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id);
    
      if(!existingOnSockets){
        this.activeSockets.push({room:link, id:client.id, userId});
        let dto;
        //fazer o check se existe registro, se tiver, substituir os dados com da tabela abaixo
        if (!history || history == null){
          dto = standardPosition as UpdateUserPositionDto;
        }else{
           dto = history;
        }
        await this.service.updateUserPosition(client.id, dto);
        const users = await this.service.listUserPositionByLink(link);
        this.wss.emit(`${link}-update-user-list`,{users});
        client.broadcast.emit(`${link}-add-user`, {user:client.id});
      }

      this.logger.debug(`Socket client: ${client.id} start to join room ${link}`)
    }

    @SubscribeMessage('move')
    async handleMove(client:Socket, payload:UpdateUserPositionDto){
      const {link, userId, x, y, orientation}= payload;
      const dto = {
        link,
        userId,
        x,
        y,
        orientation
      } as UpdateUserPositionDto
      
      // possivelmente isso me retorna os valores totais que eu preciso, posição atualizada
      // posso tentar usar isso pra criar um array e antes do disconnect salvar num objeto o
      // history[-1] que recebe esse Dto pra criar o ponto de entrada

      await this.service.updateUserPosition(client.id, dto);
      const users = await this.service.listUserPositionByLink(link);
      this.wss.emit(`${link}-update-user-list`,{users});
    
    }
    @SubscribeMessage('toggl-mute-user')
    async handleToglMute(_:Socket, payload:ToglMuteDto){
      const {link}= payload;
      
      await this.service.updateUserMute(payload);
      const users = await this.service.listUserPositionByLink(link);
      this.wss.emit(`${link}-update-user-list`,{users});
    }
    
    @SubscribeMessage('call-user')
    async callUser(client:Socket, data: any){
      this.logger.debug(`callUser: ${client.id} to: ${data.to}`);
      client.to(data.to).emit('call-made', {
        offer: data.offer,
        socket: client.id
      });
    }
    
    @SubscribeMessage('make-answer')
    async makeAnswer (client: Socket, data: any){
      this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`);
      client.to(data.to).emit('answer-made', {
        answer: data.answer,
        socket: client.id
      });
    }
}
