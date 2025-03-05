import { PartialType } from '@nestjs/mapped-types';
import { CreateOpenRecruitmentDto } from './create-open-recruitment.dto';

export class UpdateOpenRecruitmentDto extends PartialType(CreateOpenRecruitmentDto) {}
