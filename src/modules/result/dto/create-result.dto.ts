import { IsNotEmpty } from "class-validator";

export class CreateResultDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    ingame: string;

    @IsNotEmpty()
    points: number;

    @IsNotEmpty()
    description: string;
}
