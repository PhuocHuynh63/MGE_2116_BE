import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Mge {
    @Prop()
    name: string;

    @Prop()
    typeMge: string; // Type of MGE: Inf, Cav, Archer, Mixtroop

    @Prop()
    img: string;
}

export const MgeSchema = SchemaFactory.createForClass(Mge);