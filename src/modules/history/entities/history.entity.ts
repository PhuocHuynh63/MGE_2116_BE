import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class History {
    @Prop()
    id: string;

    @Prop()
    ingame: string;

    @Prop()
    points: number;

    @Prop()
    description: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
