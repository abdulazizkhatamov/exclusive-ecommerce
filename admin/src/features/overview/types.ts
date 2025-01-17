export interface IRecentSale {
  totalAmount: number;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface ICategoryPerformance {
  totalQuantity: number;
  totalRevenue: number;
  _id: string;
}

export interface ITopSellingProducts {
  name: string;
  totalSold: number;
}

export interface IOrderStatusDistribution {
  _id: string;
  count: number;
}
