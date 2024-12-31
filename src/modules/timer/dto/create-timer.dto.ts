import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { IsNotInPast } from "src/decorator/validator.custom";

export class CreateTimerDto {
    @IsNotEmpty()
    @IsNotInPast({ message: 'startTime should not be in the past' })
    startTime: string;

    @IsNotEmpty()
    @IsNotInPast({ message: 'endTime should not be in the past' })
    endTime: string;

    @IsNotEmpty()
    @IsEnum(['Infantry', 'Cavalry', 'Archer', 'Mixtroop'], {
        message: 'typeMge must be one of the following values: Infantry, Cavalry, Archer, Mixtroop',
    })
    typeMge: string;

    @IsNotEmpty()
    pointsLimit: number;

    @IsNotEmpty()
    secretKey: string;

    @IsOptional()
    users: UserRequestDto[];
}

class UserRequestDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    points: number;

    @IsNotEmpty()
    ingame: boolean;
}
