import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/modules/app/app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello world for health check' })
  @ApiResponse({
    status: 200,
    description: 'Hello world',
    type: String,
    example: 'Hello World!',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
