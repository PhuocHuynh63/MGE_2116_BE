import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Result {
    @Prop()
    id: string;

    @Prop()
    ingame: string;

    @Prop()
    pointsBided: number;

    @Prop()
    description: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
