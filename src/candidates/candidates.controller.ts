import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put, Res, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Public } from '../common/decorators';
import { Response } from 'express';
import { ApprovalCandidateDto } from './dto/approval-candidate.dto';
import { CaslAbilityGuard } from '../casl/casl.guard';
import { Action, CaslAbility, Subject } from '../casl';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Candidates')
@Controller({
  path: 'candidates',
  version: '1',
})
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Public()
  @Post('/input-nilai/:id')
  // @UseGuards(CaslAbilityGuard)
  // @CaslAbility('create:candidates')
  // @Subject('candidates') 
  // @Action('create') 
  async createCandidate(@Body() createCandidateDto: CreateCandidateDto, @Param('id') id: string) {
    try {
      const createdCandidate = await this.candidatesService.createCandidate(createCandidateDto, id);
      
      return {
        statuscode: HttpStatus.CREATED,
        message: 'Candidate created successfully',
        data: createdCandidate
      };
    } catch (error) {
      throw new HttpException('Failed to create candidate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Public()
  @Get('/detail-candidates/:id')
  // @UseGuards(CaslAbilityGuard)
  // @CaslAbility('read:candidates')
  // @Subject('candidates') 
  // @Action('read') 
  async getCandidateById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const candidate = await this.candidatesService.getCandidateById(id);
      if (!candidate) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: 'Candidate not found',
        });
      } else {
      return res.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: 'Successfully',
        data: candidate,
      });
    }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Candidate not found',
      });
    }
  }

  @Public()
  @Get('/list-candidates')
  // @UseGuards(CaslAbilityGuard)
  // @CaslAbility('read:candidates')
  // @Subject('candidates') 
  // @Action('read') 
  async findAll(@Res() response: Response): Promise<Response> {
    try {
      const candidates = await this.candidatesService.getAllCandidate();
      return response.status(200).json({
        statuscode: HttpStatus.OK,
        message: 'Successfully',
        data: candidates.map((candidate) => ({
          id: candidate.id,
          user_id: candidate.user_id,
          lk1: candidate.lk1,
          lk2: candidate.lk2,
          sc: candidate.sc,
          keaktifan: candidate.keaktifan,
          rerata: candidate.rerata,
          approval: candidate.approval,
          description: candidate.description,
        })),
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching candidates list');
    }
  }

  @Public()
  @Post('/decision/:id')
  async decision(@Body() approvalCandidateDto: ApprovalCandidateDto, @Param('id') id: string) {
    try {
      const createdCandidate = await this.candidatesService.decisionCandidate(approvalCandidateDto, id);
      
      return {
        statuscode: HttpStatus.CREATED,
        message: 'Candidate created successfully',
        data: createdCandidate
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
