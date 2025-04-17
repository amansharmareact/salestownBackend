import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  image: string;

  @IsString()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  company_id: string 

  @IsString()
  countryName: string;

  @IsString()
  currencyName: string;
}
