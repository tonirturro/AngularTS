import * as http from 'http';
import * as debug from 'debug';

debug('ts-expres: server');

const port = normalizePort(process.env.Port);

function normalizePort(val: number | string):number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port > 0) {
        return port;
    } else {
        return false;
    }
}