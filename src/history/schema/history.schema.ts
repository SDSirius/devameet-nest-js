import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HistoryDocument = HydratedDocument<History>;

@Schema()
export class History{
    @Prop({required: true})
    userId:string;

    @Prop({required: true})
    link:string;

    @Prop({required: true})
    x:number;
    
    @Prop({required: true})
    y:number;

    @Prop({required: true})
    orientation:string;
}

export const HistorySchema = SchemaFactory.createForClass(History);