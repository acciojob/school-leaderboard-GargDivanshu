const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI =
  config.MONGODB_URI || "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const Leaderboard = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 20;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

// your code here!

const removeIDV = (result) => {
    return result.map(news => {
        const { _id, __v, ...sanitizedNews } = news
        return sanitizedNews
    })
}

app.get('/topRankings', async (req, res) => {

  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const people_ = JSON.parse(JSON.stringify(await Leaderboard.find().skip(offset).limit(limit)));
    const people = removeIDV(people_);

    res.send(people);
  }
  catch(err) {
    console.log(err);
    res.status(400).send({
      status: 400,
      message: "Failed",
      error: err
    })
  }

})

// ==end==

module.exports = { app, db };