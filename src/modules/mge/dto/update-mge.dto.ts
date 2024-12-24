import { PartialType } from '@nestjs/mapped-types';
import { CreateMgeDto } from './create-mge.dto';

export class UpdateMgeDto extends PartialType(CreateMgeDto) {}
