import mongoose from 'mongoose';

const QAVectorSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    embedding: { type: [Number], required: true }
});

const QAVectorModel = mongoose.model('Question', QAVectorSchema, 'qa_vectors');

export default QAVectorModel;
