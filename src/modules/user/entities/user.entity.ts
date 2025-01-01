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

    @Prop({ type: Types.ObjectId, ref: 'User' })
    admin_key: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
