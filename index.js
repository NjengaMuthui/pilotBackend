const express = require("express");
const { selectAll, columnSelect } = require("./database/sqlmods");
const {
  queryDB,
  insertTopic,
  updateTopic,
  deleteTopic,
  insertQuestion,
  updateQuestion,
  deleteQuestion
} = require("./database/sqlqueries");
var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/questions", async (request, response) => {
  let res = await queryDB(selectAll("questions"));
  response.json(res);
});
app.post("/question", async (request, response) => {
  let res = await insertQuestion(request.body);
  console.log(res);
  response.json(res);
});
app.post("/question/update", async (request, response) => {
  let res = await updateQuestion(request.body);
  console.log(res);
  response.json(res);
});
app.delete("/question", async (request, response) => {
  let res = await deleteQuestion(request.query.ID);
  response.json(res);
});
let requests = ["topic", "subtopic", "unit"];
requests.forEach((element, index) => {
  app.post("/" + element, async (request, response) => {
    let res = await insertTopic(request.body, element);
    console.log(res);
    response.json(res);
  });
});
requests.forEach((element, index) => {
  app.post("/" + element + "/update", async (request, response) => {
    let res = await updateTopic(request.body, element);
    console.log(res);
    response.json(res);
  });
});
requests.forEach((element, index) => {
  app.get("/" + element, async (request, response) => {
    let res = await queryDB(selectAll(element));
    console.log(res);
    response.json(res);
  });
});
requests.forEach((element, index) => {
  app.delete("/" + element, async (request, response) => {
    let res = await deleteTopic(request.query.ID, element);
    console.log(res);
    response.json(res);
  });
});

app.listen(PORT, () => console.log("Server Started"));
