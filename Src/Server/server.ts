import * as http from 'http';
import * as debug from 'debug';
import App from "./App";

debug('ts-expres: server');

const port = 3000;
const server = http.createServer(App);
server.listen(port);

// Failed to listen
server.on('error', (error : NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Listening success
server.on('listening', () => {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);   
});
