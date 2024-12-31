import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
}

export const TimerSchema = SchemaFactory.createForClass(Timer);
