import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pdf')
  async getPdf(@Res() res: Response) {
    // return this.appService.getpdf();
    const buffer = await this.appService.getpdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=attendance-report-${new Date().toISOString().split('T')[0]}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
  @Get('details/pdf')
  async getDetailsPdf(@Res() res: Response) {
    // return this.appService.getpdf();
    const buffer = await this.appService.getDetailsPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=attendance-report-details-${new Date().toISOString().split('T')[0]}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
