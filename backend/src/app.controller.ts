import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/health')
export class AppController {
  constructor() {}

  @Get()
  health() {
    return {status: 'ok'}
  }
}
