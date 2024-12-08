import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResultDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    ingame: string;

    @IsNumber()
    @IsNotEmpty()
    pointsBided: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
