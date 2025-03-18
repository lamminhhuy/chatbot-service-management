import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
    text: { type: String, required: true },
    category: { type: String, required: true }
});

const PromptModel = mongoose.model('Prompt', PromptSchema, 'prompt_library');

export default PromptModel;
