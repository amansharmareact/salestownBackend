import { Controller, Get, Query, Headers, UseGuards, Body } from '@nestjs/common';
import { CountryService } from './country.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard) // using JWT
  async getCountryList(@Body('search') search: string) {
    const countries = await this.countryService.searchCountries(search);
  
    return {
      success: "true",
      message: "Countries List Fetched",
      data: countries
    };
  }
  
}


