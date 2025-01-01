import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    ingame: string;

    @Prop()
    points: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
