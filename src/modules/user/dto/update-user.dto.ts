import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    ingame: string;

    @IsNumber()
    @IsNotEmpty()
    pointsRequest: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    admin_key: string;
}