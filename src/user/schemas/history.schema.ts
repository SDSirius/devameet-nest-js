import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HistoryDocument = HydratedDocument<History>;

@Schema()
export class History{
    @Prop({eequired: true})
    name:string;

    @Prop({eequired: true})
    email:string;

    @Prop({eequired: true})
    password:string;

    @Prop()
    avatar:string;
}

export const HistorySchema = SchemaFactory.createForClass(History);