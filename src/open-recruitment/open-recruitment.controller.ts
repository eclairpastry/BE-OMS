import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus} from '@nestjs/common';
import { OpenRecruitmentService } from './open-recruitment.service';
import { CreateOpenRecruitmentDto } from './dto/create-open-recruitment.dto';
import { UpdateOpenRecruitmentDto } from './dto/update-open-recruitment.dto';
import { Public } from '../common/decorators';
import { OpenRecruitment } from './entities/open-recruitment.entity';
import { Response } from 'express';

OpenRecruitment

@Controller('open-recruitment')
export class OpenRecruitmentController {
  constructor(private readonly openRecruitmentService: OpenRecruitmentService) {}

  @Public()
  @Post("/")
  async create(
    @Body() createOpenRecruitmentDto: CreateOpenRecruitmentDto,
    @Res() res: Response
  ): Promise<Response>{
    try {
      let registration = await this.openRecruitmentService.create(createOpenRecruitmentDto);

      let {id, nra, nim, role_id, subrole_id, nama, username, email, password, no_telp, jenis_kelamin, agama, image, fakultas, program_studi, status} = registration

      return res.status(201).json({
        statusCode: 201,
        message: 'Successfully registration',
        data: {
          id, nra, nim, role_id, subrole_id, nama, username, email, password, no_telp, jenis_kelamin, agama, image, fakultas, program_studi, status
        }
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        error: "Internal Server Error",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
    }
  }
}
