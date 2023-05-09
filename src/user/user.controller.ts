import {Controller, Get, Request, BadRequestException, Body, Put, HttpCode, HttpStatus} from '@nestjs/common';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { UserMessagesHelper } from './helpers/messages.helper';
<<<<<<< Updated upstream
import { UserService } from './user.service'
import { UpdateUsertDto } from './dtos/updateuser.dto'

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService){}
=======
import { UserService } from './user.service';

@Controller('user')
export class UserController{
    constructor(private readonly userSerice:UserService){}
>>>>>>> Stashed changes

    @Get()
    async getUser(@Request() req){
        const {userId} = req?.user;
<<<<<<< Updated upstream
        const user = await this.userService.getUserById(userId);
=======
        const user = await this.userSerice.getUserById(userId);
>>>>>>> Stashed changes

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
    async updateUser(@Request() req, @Body() dto: UpdateUserDto){
        const {userId} = req?.user;
        await this.userSerice.updateUser(userId, dto);
    }
}