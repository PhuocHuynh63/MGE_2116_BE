import { IsNotEmpty } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty({ message: 'ID is required' })
    id: string;

    @IsNotEmpty({ message: 'Ingame name is required' })
    ingame: string;

    @IsNotEmpty({ message: 'Points is required' })
    pointsRequest: number;
}

export class RequestUserDto {
    @IsNotEmpty({ message: 'ID is required' })
    id: string;

    @IsNotEmpty({ message: 'Ingame name is required' })
    ingame: string;

    @IsNotEmpty({ message: 'Points is required' })
    pointsRequest: number;

    @IsNotEmpty({ message: 'Secret key is required' })
    secretKey: string;
}

