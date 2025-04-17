// src/city/city.controller.ts
import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @Get('list/:stateId')
   @UseGuards(JwtAuthGuard)
  async getCities(@Param('stateId', ParseIntPipe) stateId: number) {
    const cities = await this.cityService.getCitiesByStateId(stateId);
    return {
      success: 'true',
      message: 'Cities fetched successfully',
      data: cities,
    };
  }
}

