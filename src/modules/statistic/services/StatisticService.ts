import { injectable, inject } from "tsyringe";
import RevenueService from "@/modules/payment/services/RevenueService";
import { UserService } from "@/modules/user/services/UserService";
import UserSubscriptionService from "@/modules/subscription/services/UserSubscriptionService";
import PostService from "@/modules/post/services/PostService";
import { StatisticResponse } from "../interfaces/StatisticResponse";
@injectable()
class StatisticService {
    constructor(
@inject(RevenueService) private revenueService: RevenueService,
@inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService,
@inject(UserService) private userService: UserService,
@inject(PostService) private postService: PostService) {
    }
    private getNewUsersWithGrowthFromLastMonth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}> {
        return this.userService.getUserCountWithMonthlyGrowth();
    }
    private getTotalRevenueWithGrowthFromLastMonth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}> {
        return this.revenueService.getTotalRevenueWithGrowthFromLastMonth();
    }
    private getTotalUserSubscriptionWithGrowthFromLastMonth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}> {
        const subscriptions = this.userSubscriptionService.getTotalUserSubscriptionWithGrowthFromLastMonth();
        return subscriptions;
    }
    private getTotalPostWithMonthlyGrowth(): Promise<{total: number, currentMonth: number, previousMonth: number, growthRate: number}> {
        return this.postService.getTotalPostWithMonthlyGrowth();
    }
    public async getStatistic(): Promise<StatisticResponse> {
        const userData =  await this.getNewUsersWithGrowthFromLastMonth();
        const revenueData = await this.getTotalRevenueWithGrowthFromLastMonth();
        const userSubscriptionData = await this.getTotalUserSubscriptionWithGrowthFromLastMonth();
        const postCountData = await this.getTotalPostWithMonthlyGrowth();
        return {
            users: {total:userData.total,
                growthRate:userData.growthRate
            },
            revenue: {
                total:revenueData.total,
                growthRate:revenueData.growthRate
            },
            userSubscriptions: {
                total:userSubscriptionData.total,
                growthRate:userSubscriptionData.growthRate
            },
            posts: {
                total:postCountData.total,
                growthRate:postCountData.growthRate
            }
        };
    }
}
export default StatisticService