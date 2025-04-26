import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}
  async searchCountries(search?: string): Promise<Country[]> {
    try {
      const query = this.countryRepository.createQueryBuilder('country');
  
      if (search && search.trim() !== '') {
        query.where('country.name ILIKE :search', { search: `%${search}%` })
             .orWhere('CAST(country.phonecode AS TEXT) LIKE :search', { search: `%${search}%` });
      }
  
      const countries = await query.getMany();
      return countries;
    } catch (error) {
      console.error('Error searching countries:', error);
      
      throw new Error('Failed to search countries');
    }
  }
 
}


