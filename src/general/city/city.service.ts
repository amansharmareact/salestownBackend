
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { State } from '../state/entities/state.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
  ) {}


  async getCitiesByStateId(stateId: number) {
    try {
      const state = await this.cityRepo.manager.findOne(State, {
        where: { id: stateId },
      });
  
      if (!state) {
        console.log(`State with ID ${stateId} not found.`);
        return []; 
      }
  
      return await this.cityRepo.find({
        where: {
          state: { id: stateId },
        },
      });
    } catch (error) {
      console.error('Error fetching cities by state ID:', error);
  
      throw new Error('Failed to fetch cities for the provided state ID');
    }
  }
  
  

}



