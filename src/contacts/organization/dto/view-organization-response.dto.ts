export class ViewOrganizationResponse {
    success: string;
    message: string;
    data: {
      details: {
        org_id: string;
        name: string;
        address: string;
        address_line_2: string;
        country: string;
        state: string;
        city: string;
        pincode: number;
        gst: string;
        pan: string;
        website: string;
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        created_at: string;
        updated_at: string;
        added_by: string;
        user_name: string;
        followers: { id: string; name: string }[];
      };
      custom_columns: {
        id: number;
        label: string;
        name: string;
        type: number;
        input_type: string;
        option_value: string;
        customColumn_value: {
          id: number;
          column_value: string;
        };
      }[];
      persons: {
        person_id: number;
        name: string;
        email: string;
        phone: string;
      }[];
      reports: {
        date_of_first_order: string | null;
        date_of_last_order: string | null;
        total_order_qty: number;
        total_order_value: number;
        total_avg_value: number;
        total_avg_per_month_value: number;
        lead_started: string;
        lead_added: number;
        lead_won_qty: number;
        lead_won_value: number;
        lead_lost_qty: number;
        lead_lost_value: number;
        lead_open_qty: number;
        lead_open_value: string;
      };
    };
  }
  