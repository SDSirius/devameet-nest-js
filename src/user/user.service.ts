import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RegisterDto } from './dtos/register.dto'
import { User, UserDocument } from './schemas/user.schema'
import * as CryptoJS from 'crypto-js'
import { UpdateUsertDto } from './dtos/updateuser.dto'
import { HistoryDto } from './dtos/history.dto'
import { HistoryDocument } from './schemas/history.schema'

type LoadHistory = {
  userId:String; 
  link:string; 
  x:String;
  y:String;
  orientation:string;   
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(History.name) private HistoryModel: Model<HistoryDocument>
  ) {}
  

  async create(dto: RegisterDto): Promise<User> {
  dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();

  const createdUser = new this.userModel(dto);
  return createdUser.save();
}

async existsByEmail(email: String) : Promise<boolean>{
  const result = await this.userModel.findOne({email});
  if(result){
    return true;
  }
  return false;
 }

 async getUserByLoginPassword(email: string, password: string) : Promise<UserDocument | null>{
  const user = await this.userModel.findOne({email}) as UserDocument;

  if(user){
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.USER_CYPHER_SECRET_KEY );
    const savedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if(password == savedPassword){
      return user;  // adicionar chamada de função para carregar histórico
    }
  }

  return null;
 }

 async getUserById(id:string){
  return await this.userModel.findById(id);
 }

 async getHistory(){

 }

 async updateUser(id:string, dto: UpdateUsertDto){
  return await this.userModel.findByIdAndUpdate(id, dto);
 }
}