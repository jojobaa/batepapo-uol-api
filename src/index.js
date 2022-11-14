import express from 'express'
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi'
import dayjs from "dayjs";

dotenv.config();

const userSchema = joi.object({
  name: joi.string().required()
});

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().valid("message", "private_message").required()
});

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

await mongoClient.connect().then(() => {
  db = mongoClient.db("Bate-papo-uol");
});

server.post("/participants", async (req, res) => {
  const user = req.body.name;
  const validation = userSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const userExist = await db.collection("participants").findOne({ name: user })

    if (userExist) {
      res.sendStatus(409);
      return;
    }

    await db.collection("participants").insertOne({ name: user, lastStatus: Date.now() })
    await db.collection("messages").insertOne({ from: user, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format("HH:mm:ss") })
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

})

server.get("/participants", async (req, res) => {
  try {
    const users = await db.collection("participants").find().toArray();
    res.send(users);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

server.post("/messages", async (req, res) => {
  const messageTo = req.body.to;
  const messageText = req.body.text;
  const messageType = req.body.type;
  const messageFrom = req.headers.user;
  const validation = messageSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const userExist = await db.collection("participants").findOne({ name: messageFrom })

    if (!userExist) {
      res.sendStatus(409);
      return;
    }

    await db.collection("messages").insertOne({ from: messageFrom, to: messageTo, text: messageText, type: messageType, time: dayjs().format("HH:mm:ss") })
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

})

server.get("/messages", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const user = req.headers.user;

  try {
    const texts = await db.collection("messages").find({
      $or: [
        {
          to: "Todos"
        },
        {
          to: user
        },
        {
          from: user
        }
      ]
    }).sort({ _id: -1 }).limit(limit).toArray();
    res.send(texts.reverse());
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

server.post("/status", async (req, res) => {
  const user = req.headers.user;
  try {
    const userExist = await db.collection("participants").findOne({ name: messageFrom })

    if (!userExist) {
      res.sendStatus(409);
      return;
    }
   await db.collection("participants").updateOne({name: user}, {$set: {lastStatus: Date.now()}})
   res.sendStatus(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

server.listen(5000, () => console.log("Server in port 5000"));
