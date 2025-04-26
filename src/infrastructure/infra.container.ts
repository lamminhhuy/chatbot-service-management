import RedisClient from "@/database/redisClient"
import { container } from "tsyringe"
import { RedisSessionStore } from "./session/RedisSessionStore"
import { OpenAIAPI } from "../external/openai/OpenAIAPI"
import { env } from "@/configs/envConfig"
import { WebSearchService } from "../external/web-search/WebSearchService"
import Redis from "ioredis"
import { TypeOrmUnitOfWork } from "./uow/TypeOrmUnitOfWork"


export const registerInfraDependencies = () => {
    container.register(Redis, {useValue: RedisClient.getInstance()})
    container.register('ISessionStore', {useValue: new RedisSessionStore(RedisClient.getInstance())})
    container.register('IWebSearchService', {useValue: new WebSearchService(env.SERP_API_KEY)})
    container.register('IChatbotAPI',{useFactory: () => new OpenAIAPI(env.OPENAI_API_KEY, env.OPENAI_ASSISTANT_ID, container.resolve('IWebSearchService'))})
    container.register('IUnitOfWorkService', {useValue: new TypeOrmUnitOfWork()})
}
