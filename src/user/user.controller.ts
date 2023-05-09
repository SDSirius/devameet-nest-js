import { Body, Controller, Get, HttpCode, HttpStatus, Put, Request } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserMessagesHelper } from './helpers/messages.helper';
import { UserService } from './user.service'
import { UpdateUsertDto } from './dtos/updateuser.dto'
import { HistoryService } from 'src/history/history.service';

@Controller('user')
export class UserController{
    constructor(
        private readonly userService: UserService,
        private readonly historyService: HistoryService,
        ){}

    @Get()
    async getUser(@Request() req){
        const {userId} = req?.user;
        const user = await this.userService.getUserById(userId);
        const LoadHistory = await this.historyService.getHistoryByUserId(userId);

        if(!user){
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user._id
        }
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req, @Body() dto: UpdateUsertDto){
        const {userId} = req?.user;
        await this.userService.updateUser(userId, dto)
    }

}