import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoanService } from './loan.service';
import { TokenizeLoanDto } from './dto/tokenize-loan.dto';
import { UploadFile } from '../types';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Loan')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('upload-csv')
  @ApiOperation({ summary: 'Upload a CSV file containing loans data' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: UploadFile) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.loanService.uploadCsv(file);
  }

  @Get('all-loans')
  @ApiOperation({ summary: 'Get all loans' })
  findAll() {
    return this.loanService.findAll();
  }

  @Post('tokenize-loans')
  @ApiOperation({ summary: 'Tokenize loans' })
  tokenize(@Body() tokenizeLoanDto: TokenizeLoanDto) {
    // Support both single and multiple loan IDs
    const loanIds =
      tokenizeLoanDto.loanIds ||
      (tokenizeLoanDto.loanId ? [tokenizeLoanDto.loanId] : []);

    if (loanIds.length === 0) {
      throw new BadRequestException('No loan IDs provided');
    }

    const results = loanIds.map((id) => {
      const loan = this.loanService.tokenize(id);
      if (!loan) {
        throw new BadRequestException(`Loan ${id} not found`);
      }
      return loan;
    });

    return results.length === 1 ? results[0] : results;
  }
}
