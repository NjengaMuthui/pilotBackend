const connection = require("./sqlconnection");
const { addColumn, createTable, dropColumn, dropTable } = require("./sqlmods");

async function queryDB(query) {
  const [rows] = await connection.query(query);
  return rows;
}

async function insertQuestion(Q) {
  let categories = await getCategories();
  let appendColumn = "";
  let appendPlaceholder = "";
  let valuesArr = [
    Q.question,
    Q.answer,
    Q.choiceone,
    Q.choicetwo,
    Q.choicethree
  ];

  categories.forEach((element) => {
    appendColumn = appendColumn + "," + element;
    appendPlaceholder = appendPlaceholder + ",?";
    valuesArr.push(Q[element]);
  });

  const [rows] = await connection.query(
    "insert into questions (question,answer,choiceone,choicetwo,choicethree" +
      appendColumn +
      ") values(?,?,?,?,?" +
      appendPlaceholder +
      ")",
    valuesArr
  );
  return rows;
}
async function updateQuestion(Q) {
  let categories = await getCategories();
  let appendColumn = "";
  let valuesArr = [
    Q.question,
    Q.answer,
    Q.choiceone,
    Q.choicetwo,
    Q.choicethree
  ];
  categories.forEach((element) => {
    appendColumn = appendColumn + ",set " + element + "=?";
    valuesArr.push(Q[element]);
  });
  appendColumn = appendColumn + " ";
  valuesArr.push(Q.ID);
  const [rows] = await connection.query(
    "update questions set question=?, set answer=?,set choiceone=?,set choicetwo=?,set choicethree=?" +
      appendColumn +
      " where ID=?",
    valuesArr
  );
  return rows;
}
async function deleteQuestion(question) {
  const [rows] = await connection.query("delete from questions where ID=?", [
    question
  ]);
  return rows;
}
async function insertTopic(topic, table) {
  const [rows] = await connection.query(
    "insert into " + table + " (longname, shortname) values(?,?)",
    [topic.longname, topic.shortname]
  );
  return rows;
}
async function updateTopic(topic, table) {
  const [rows] = await connection.query(
    "update " + table + " set longname=?, shortname=? where ID=?",
    [topic.longname, topic.shortname, topic.ID]
  );
  return rows;
}
async function deleteTopic(topic, table) {
  const [rows] = await connection.query(
    "delete from " + table + " where ID=?",
    [topic]
  );
  return rows;
}
async function getCategories() {
  const [rows] = await connection.query(
    "SELECT column_name FROM information_schema.columns WHERE  table_name = 'questions'AND table_schema = 'pilot'"
  );
  // extract the column names from the result set and store in an array
  let arr = [];
  rows.forEach((element) => arr.push(element.column_name));

  // remove permanent columns from the array
  arr = arr.splice(6, arr.length - 6);
  return arr;
}
async function createCategory(category) {
  const [rows] = await connection.query(addColumn(category));
  const [result] = await connection.query(createTable(category));
  return { rows, result };
}
async function removeCategory(category) {
  const [rows] = await connection.query(dropColumn(category));
  const [result] = await connection.query(dropTable(category));
  return { rows, result };
}
module.exports = {
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
};
