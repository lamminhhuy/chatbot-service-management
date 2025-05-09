export interface StatisticItem {
    total: number;
    growthRate: number;
  }
export interface StatisticResponse {
    users: StatisticItem;
    revenue: StatisticItem;
    userSubscriptions: StatisticItem;
    posts: StatisticItem;
  }