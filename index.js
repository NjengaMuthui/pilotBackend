const express = require("express");
const {
  selectAll,
  columnSelect,
  getQuestionsOnTopics,
  processQuestions
} = require("./database/sqlmods");
const {
  queryDB,
  insertTopic,
  updateTopic,
  deleteTopic,
  insertQuestion,
  updateQuestion,
  deleteQuestion,
  getCategories,
  createCategory,
  removeCategory
} = require("./database/sqlqueries");
var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/question/categories", async (request, response) => {
  let res;
  if (request.body.operation == 0) {
    res = await createCategory(request.body.name);
  } else {
    res = await removeCategory(request.body.name);
  }

  response.json(res);
});
app.get("/question/categories", async (request, response) => {
  let categories = await getCategories();
  response.json(categories);
});

app.get("/questions", async (request, response) => {
  let categories = await getCategories();
  let res = await queryDB(getQuestionsOnTopics(categories));
  response.json(processQuestions(res, categories));
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
app.post("/category", async (request, response) => {
  let res = await insertTopic(request.body, request.body.type);
  console.log(res);
  response.json(res);
});
app.put("/category", async (request, response) => {
  let res = await updateTopic(request.body, request.body.type);
  console.log(res);
  response.json(res);
});
app.get("/category", async (request, response) => {
  console.log(request.body);
  let res = await queryDB(selectAll(request.query.type));
  console.log(res);
  response.json(res);
});
app.delete("/category", async (request, response) => {
  let res = await deleteTopic(request.query.ID, request.body.type);
  console.log(res);
  response.json(res);
});

app.listen(PORT, () => console.log("Server started"));
