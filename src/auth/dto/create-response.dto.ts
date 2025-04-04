export class UserResponseDto {
    success: boolean;
    message: string;
    data: {
      user_id: string;
      company_id: string;
      company_name: string;
      name: string;
      email: string;
      phone: string;
      token: string;
      customer_id: string;
      role: string;
      day_left: number;
      image: string;
      currency_id: string;
      currency_icon: string;
      currency_unicode: string;
      currency_name: string;
    };
    }