import { IsOptional } from "class-validator";

export class CreateMgeDto {
    @IsOptional()
    name: string;

    @IsOptional()
    typeMge: string;

    @IsOptional()
    img: string;
}
