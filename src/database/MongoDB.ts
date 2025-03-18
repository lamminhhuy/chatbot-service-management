import { env } from '@/configs/envConfig';
import mongoose  from 'mongoose' 

class MongoDB {
 static instance: MongoDB
    constructor() {
        this.connect();
      }
      //connect
      connect(type = "mongodb") {
        if (1 === 1) {
          mongoose.set("debug", true);
          mongoose.set("debug", { color: true });
        }
    
        mongoose
          .connect(env.MONGO_URI, {
            maxPoolSize: 50,
          })
          .then((_) => {
            console.log(`Connected Mongodb Success`);
          })
          .catch((err) => console.log(`Error Connect!`));
      }

      static getInstance() {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
      }
    }

export const mongoDBInstance =  MongoDB.getInstance()