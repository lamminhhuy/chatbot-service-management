
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import StatisticController from "../controllers/StatisticController";
import { container } from "tsyringe";

const statisticController = container.resolve(StatisticController);
export const statisticModule: ModuleConfig ={
    prefix:"/statistic",
    moduleName:"statistic",
    routes:[
        {
            path:"/",
            method:"GET",
            handler:{controller:"statisticController",action:statisticController.handleGetStatistic.bind(statisticController)}
        }
    ]
}