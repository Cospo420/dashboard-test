export interface DashboardData {
    stats: {
      totalCalls: number;
      appointmentsBooked: number;
      averageDuration: number;
      averageRating: number;
      conversionRate: number;
    };
    volumeData: {
      date: string;
      calls: number;
    }[];
    recentCalls: {
      id: string;
      call_id: string;
      call_type: string;
      from_number: string;
      to_number: string;
      duration: number;
      rating: number;
      appointment_booked: boolean;
      summary: string;
      formatted_start_time: string;
      sentiment: string;
    }[];
    typeDistribution: {
      name: string;
      value: number;
    }[];
    customerData: {
      satisfaction: number;
      nps: number;
      firstCallResolution: number;
    };
    securityData: {
      complianceRate: number;
      securityIssues: number;
      dataProtection: number;
    };
    timeSeriesData: {
      name: string;
      resolutionRate: number;
      calls: number;
      satisfaction: number;
      nps: number;
      complianceRate: number;
      securityIssues: number;
    }[];
    lastUpdated: string;
  }