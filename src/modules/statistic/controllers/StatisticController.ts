import { inject } from "tsyringe";
import StatisticService from "../services/StatisticService";
import { Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import { injectable } from "tsyringe";

@injectable()   
class StatisticController {
    constructor(@inject(StatisticService) private statisticService: StatisticService) {
    }
    async handleGetStatistic(req:Request,res:Response) {
    const statistic = await this.statisticService.getStatistic();
   new SuccessResponse({data:statistic,
    message:"Get statistic successfully"
   }).send(res);
    }
}
export default StatisticController;
