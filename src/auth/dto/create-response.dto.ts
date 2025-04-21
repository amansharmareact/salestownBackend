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
    //token: string;
    customer_id: string | null;  // Change this to 'string | null'
    role: string;
    day_left: number;
    image: string;
    currency_id: string | null;
    currency_icon: string;
    currency_unicode: string;
    currency_name: string;
  };
  }
  