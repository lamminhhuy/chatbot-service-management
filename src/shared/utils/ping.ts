import { IncomingMessage } from 'http';
import  https from 'https';

export function pingServer() {
  const options = {
    hostname: 'https://chatbot-gpt-mkqi.onrender.com',
    port: 443,
    path: '/',
    method: 'GET'
  };

  const req = https.request(options, (res: IncomingMessage) => {
    console.log(`Server pinged. Status code: ${res.statusCode}`);
  });

  req.on('error', (error: any) => {
    console.error(`Error pinging server: ${error.message}`);
  });

  req.end();
}
