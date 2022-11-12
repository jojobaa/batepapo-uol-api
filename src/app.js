import express from 'express'
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi'

dotenv.config();

const server = express();
server.use(cors());
server.use(json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

await mongoClient.connect().then(() => {
	db = mongoClient.db("Bate papo uol");
});

// db.collection("users").insertOne({
// 	email: "joao@email.com",
// 	password: "minha_super_senha"
// });

// db.users.insert({name: 'João', lastStatus: 12313123});
// db.message.insert({from: 'João', to: 'Todos', text: 'oi galera', type: 'message', time: '20:04:37'});
// db.users.find(users);

app.get("/", (req, res) => {
    // res.send('Hello World');
});
app.post('/participants', async (req, res) => {
  try{

  }catch{
    
  }
    // perticipants.push({ name: "Fulano" });
    // res.send(participants);
  });


app.listen(5000, () => console.log("Server in port 5000"));