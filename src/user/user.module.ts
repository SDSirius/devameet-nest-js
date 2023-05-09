import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { HistoryModule } from "src/history/history.module";
import { HistoryService } from "src/history/history.service";


@Module({
    imports: [MongooseModule.forFeature([{name : User.name, schema : UserSchema}]),
    HistoryModule],
    controllers: [UserController],
    providers: [UserService, HistoryService],
    exports: [MongooseModule, UserService, HistoryService]
})
export class UserModule{}