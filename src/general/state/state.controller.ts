import { Body, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { GetStatesDto } from './dtos/state.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

 
  @Get('list')
  async getStates(
    @Query() query: GetStatesDto, 
    @Body() body: GetStatesDto,   
  ) {
    const countryId = query.countryId || body.countryId; // Get countryId from query or body

    if (!countryId) {
      return {
        success: 'false',
        message: 'Country ID is required',
      };
    }

    const states = await this.stateService.getStatesByCountryId(countryId);
    return {
      success: 'true',
      message: 'States fetched successfully',
      data: states,
    };
  }
}
