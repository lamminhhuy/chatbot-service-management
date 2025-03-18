import { QAVector } from "../../entites/QAVector";


export interface IVectorRepository {
    findSimilarQuestions: (vectorQuery: number[]) => Promise<QAVector>
}