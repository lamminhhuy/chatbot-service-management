import { MongoClient } from 'mongodb'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../assets/OWASPQA.csv');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://chatbot-mongo:27017/chatbotdb';
const DB_NAME = 'chatbotdb';
const COLLECTION_NAME = 'qa_vectors';
const PROMPT_COLLECTION = 'prompt_library';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

function readDataFile() {
  try {
    return fs.readFileSync(DATA_FILE, 'utf-8');
  } catch (err) {
    console.error('Error reading data file:', err);
    process.exit(1);
  }
}

async function checkAndCreateDB(client) {
  const adminDb = client.db().admin();
  const databases = await adminDb.listDatabases();
  const dbExists = databases.databases.some(db => db.name === DB_NAME);

  if (!dbExists) {
    console.log(`Database ${DB_NAME} does not exist. Creating...`);
    await client.db(DB_NAME).createCollection(COLLECTION_NAME);
    await client.db(DB_NAME).createCollection(PROMPT_COLLECTION);
    console.log(`Database ${DB_NAME} and collections created.`);
  } else {
    console.log(`Database ${DB_NAME} already exists.`);
  }
}

export function extractQAPairs(csvData) {
  const lines = csvData.split("\n").map(line => line.trim()).filter(line => line !== "");
  const parsedContent = [];
  let currentQuestion = "", currentAnswer = "";

  for (const line of lines) {
    if (line.match(/^"\d+\./)) {
      if (currentQuestion && currentAnswer) {
        parsedContent.push({ type: "qa", question: currentQuestion, answer: currentAnswer.trim() });
      }
      currentQuestion = line.replace(/^"|"$/g, "");
      currentAnswer = "";
    } else if (line.startsWith('"') && currentQuestion) {
      currentAnswer += line.replace(/^"|"$/g, "") + " ";
    } else if (currentQuestion) {
      currentAnswer += line + " ";
    } else {
      parsedContent.push({ type: "other", content: line });
    }
  }

  if (currentQuestion && currentAnswer) {
    parsedContent.push({ type: "qa", question: currentQuestion, answer: currentAnswer.trim() });
  }

  return parsedContent;
}

async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function withMongoClient(callback) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    await checkAndCreateDB(client);
    await callback(client.db(DB_NAME));
  } catch (err) {
    console.error('MongoDB operation error:', err);
  } finally {
    await client.close();
  }
}

async function migrateQA() {
  const data = readDataFile();
  const qaPairs = extractQAPairs(data);

  await withMongoClient(async (db) => {
    const collection = db.collection(COLLECTION_NAME);
    await collection.deleteMany({}); 
    for (const { question, answer } of qaPairs) {
      const embedding = await generateEmbedding(question);
      await collection.insertOne({ question, answer, embedding });
      console.log(`Inserted QA: ${question}`);
    }
    console.log('QA Migration completed successfully!');
  });
}

async function migratePrompts() {
  const data = readDataFile();
  const qaPairs = extractQAPairs(data);

  await withMongoClient(async (db) => {
    const collection = db.collection(PROMPT_COLLECTION);
    await collection.deleteMany({});
    await collection.insertMany(qaPairs.map(({ question }) => ({ text: question, category: 'write' })));
    console.log(`Inserted ${qaPairs.length} prompts into ${PROMPT_COLLECTION}`);
    console.log('Prompt Migration completed successfully!');
  });
}

async function createVectorIndex() {
  await withMongoClient(async (db) => {
    const collection = db.collection(COLLECTION_NAME);
    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [{ type: "vector", numDimensions: 768, path: "embedding", similarity: "cosine", quantization: "scalar" }]
      }
    };
    const result = await collection.createSearchIndex(index);
    console.log(`New search index named ${result} is building.`);
    console.log("Polling to check if the index is ready. This may take up to a minute.");
    let isQueryable = false;
    while (!isQueryable) {
      for await (const idx of collection.listSearchIndexes()) {
        if (idx.name === result && idx.queryable) {
          console.log(`${result} is ready for querying.`);
          isQueryable = true;
          break;
        }
      }
      if (!isQueryable) await new Promise(resolve => setTimeout(resolve, 5000));
    }
  });
}

async function migrate() {
  await createVectorIndex();
  await migrateQA();
  await migratePrompts();
}

migrate();
