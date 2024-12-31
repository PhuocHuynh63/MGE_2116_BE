import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Timer {
    @Prop()
    startTime: string;

    @Prop()
    endTime: string;

    @Prop({ enum: ['Infantry', 'Cavalry', 'Archer', 'Mixtroop'] })
    typeMge: string;

    @Prop()
    pointsLimit: number;

    @Prop({ default: 'active' })
    status: string;

    @Prop()
    users: UserBid[];
}

class UserBid {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    id: Types.ObjectId;

    @Prop()
    ingame: string;

    @Prop()
    points: number;
}

export const TimerSchema = SchemaFactory.createForClass(Timer);
