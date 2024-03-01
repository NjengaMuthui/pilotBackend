const express = require("express");
const {
  selectAll,
  getQuestionsOnTopics,
  processQuestions,
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
  removeCategory,
  getExamQuestions,
  getQuestionsCount,
} = require("./database/sqlqueries");

var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "200mb" }));

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
app.get("/test", async (request, response) => {
  response.json({
    data: "Okay This seems to be working",
  });
});
app.get("/count", async (request, response) => {
  let questionCount = await getQuestionsCount(request.query);
  response.json(questionCount);
});
app.get("/questions", async (request, response) => {
  try {
    let categories = await getCategories();
    console.log(request.query);

    let res = await queryDB(getQuestionsOnTopics(categories, request.query));
    response.json(processQuestions(res, categories));
  } catch (error) {
    response.json(error);
  }
});
app.post("/questions", async (request, response) => {
  let success = 0;
  request.body.forEach(async (element) => {
    let res = await insertQuestion(element);
    success++;
  });
  console.log(success);
  response.json(success);
});
app.post("/question", async (request, response) => {
  let res = await insertQuestion(request.body);
  console.log(res);
  response.json(res);
});
app.put("/question", async (request, response) => {
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
  console.log(request.body);
  try {
    let res = await updateTopic(request.body, request.body.type);
    console.log(res);
    response.json(res);
  } catch (error) {
    response.json(error);
  }
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
app.post("/exam", async (request, response) => {
  let res = await getExamQuestions(request.body);
  response.json(res);
});

app.listen(PORT, () => console.log("Server started"));
