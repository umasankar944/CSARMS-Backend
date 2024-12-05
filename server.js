// import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/routes.js';
import { getConnection } from './models/db.js';




console.log('JWT Secret:', process.env.TOKEN);
const app = express();
const server = http.createServer(app);
const PORT = 5000;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3001', // Adjust this to your frontend URL
  methods: ['GET', 'POST','PUT','DELETE']
}));

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Set up routes
app.use(router);

// Connect to the database
getConnection();

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
