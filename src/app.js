import express from 'express'
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // res.send('Hello World');
});
app.post('/pessoas', (req, res) => {
    // pessoas.push({ name: "Fulano" });
    // res.send(pessoa);
  });

// const mongoClient = new MongoClient("mongodb://localhost:27017");
// let db;

// mongoClient.connect().then(() => {
// 	db = mongoClient.db("meu_lindo_projeto"); //O padrão é test
// });

app.listen(5000);