import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
  ) {}

  async getStatesByCountryId(countryId: number) {
    try {
      const states = await this.stateRepo.find({
        where: { country: { id: countryId } },
      });
      return states;
    } catch (error) {
    
      console.error('Error fetching states by country ID:', error);

      throw new Error('Failed to fetch states for the provided country ID');
    }
  }
  

 
}

 {/**async getStatesByCountryId(countryId: number) {
    return this.stateRepo.find({ where: { country: { id: countryId } }, });
  }*/}
