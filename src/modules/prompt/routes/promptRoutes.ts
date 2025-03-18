
import asyncHandler from "@/shared/utils/asyncHandler";
import { Request, Response, Router } from "express";
import { PromptController } from "../controllers/PromptController";
import { PromptRespository } from "../repositories/PromptRespository";
import {  PromptService } from "../services/PromptServices";
;

const promptRouter = Router();
const promptRepository = new PromptRespository()
const handleFetchPrompt = new PromptService(promptRepository)
const promptController = new PromptController(handleFetchPrompt)

promptRouter.get(
  "/",
  asyncHandler((req: Request, res: Response) =>
    promptController.handleFetchAll(req, res)
  )
);

export default promptRouter;
