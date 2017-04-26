import * as http from "http";
import * as express from "express";
import { App } from "./App";

console.log("ts-expres: server");

const port = 3000;
const server = http.createServer(new App(express()).express);
server.listen(port);

// Failed to listen
server.on("error", (error : NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;
  const bind = `port ${port}`;
  switch(error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Listening success
server.on("listening", () => {
  const addr = server.address();
  const bind = `port ${addr.port}`;
  console.log(`Listening on ${bind}`);   
});
