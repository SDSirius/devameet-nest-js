import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
    @Prop({eequired: true})
    name:string;

    @Prop({eequired: true})
    email:string;

    @Prop({eequired: true})
    password:string;

    @Prop()
    avatar:string;
}

export const UserSchema = SchemaFactory.createForClass(User)