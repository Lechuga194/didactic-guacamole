import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import Server from './models/server';

new Server().listen();
