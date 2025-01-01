import { IsNotEmpty } from "class-validator";

export class CreateHistoryDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    ingame: string;

    @IsNotEmpty()
    points: number;

    @IsNotEmpty()
    description: string;
}
