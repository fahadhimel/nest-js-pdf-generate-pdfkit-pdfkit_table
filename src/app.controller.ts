import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import { AppService2 } from './app.service2';
import { Response } from 'express';
import { AppService2 } from './app2.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appService2: AppService2,
  ) {}

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
  @Get('details/pdf/test')
  async testColorPDF(@Res() res: Response) {
    // return this.appService.getpdf();
    const buffer = await this.appService2.testColorPDF2();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=attendance-report-details-${new Date().toISOString().split('T')[0]}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
