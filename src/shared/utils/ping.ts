const https = require('https');

export function pingServer() {
  const options = {
    hostname: 'dict-api.suoinuocsong.info',
    port: 443,
    path: '/',
    method: 'GET'
  };

  const req = https.request(options, (res: Response) => {
    console.log(`Server pinged. Status code: ${res.status}`);
  });

  req.on('error', (error: any) => {
    console.error(`Error pinging server: ${error.message}`);
  });

  req.end();
}
