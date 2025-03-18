
import { IVectorRepository } from "@/shared/interfaces/repositories/IVectorRepository";
import { PipelineStage } from "mongoose";
import QAVectorModel from "../models/QASchema";

export class VectorRepositoryImpl implements IVectorRepository {
    async findSimilarQuestions (queryVector: number[]) {
        const agg = [
            {
              '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': queryVector,
                exact: true,
                limit: 1
              }
            }, {
              '$project': {
                '_id': 0,
                'answer': 1, 
                'question': 1,
                'score': {
                  '$meta': 'vectorSearchScore'
                }
              }
            }
          ];
          const result = await QAVectorModel.aggregate(agg as PipelineStage[]);
          if(result[0].score > 0.9)
          {
          return result[0]
          }
          return null
        }
}