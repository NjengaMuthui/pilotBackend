const connection = require("./sqlconnection");
const {
  addColumn,
  createTable,
  dropColumn,
  dropTable,
  insertDefault,
  examQuery,
  shuffle,
} = require("./sqlmods");

async function queryDB(query) {
  const [rows] = await connection.query(query);
  return rows;
}

async function insertQuestion(Q) {
  //let categories = await getCategories();
  let appendColumn = "";
  let appendPlaceholder = "";
  let valuesArr = [
    Q.question,
    Q.answer,
    Q.choiceone,
    Q.choicetwo,
    Q.choicethree,
    Q.level,
    Q.subject,
    Q.uuid,
  ];

  /*categories.forEach((element) => {
    appendColumn = appendColumn + "," + element;
    appendPlaceholder = appendPlaceholder + ",?";
    valuesArr.push(Q[element]);
  });
*/
  const [rows] = await connection.query(
    "insert into questions (question,answer,choiceone,choicetwo,choicethree," +
      "level,subject,uuid" +
      //appendColumn +
      ") values(?,?,?,?,?,?,?,?" +
      //appendPlaceholder +
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
    Q.choicethree,
    Q.level,
    Q.subject,
    Q.uuid,
  ];
  categories.forEach((element) => {
    appendColumn = appendColumn + "," + element + "=?";
    valuesArr.push(Q[element].ID);
  });
  valuesArr.push(Q.ID);
  const [rows] = await connection.query(
    "update questions set question=?,answer=?,choiceone=?,choicetwo=?,choicethree=?," +
      "level=?,subject=?,uuid=?" +
      appendColumn +
      " where ID=?",
    valuesArr
  );
  return rows;
}
async function deleteQuestion(question) {
  const [rows] = await connection.query("delete from questions where ID=?", [
    question,
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
  arr = arr.splice(9, arr.length - 9);
  return arr;
}
async function createCategory(category) {
  const [rows] = await connection.query(addColumn(category));
  const [result] = await connection.query(createTable(category));
  const [third] = await connection.query(insertDefault(category));
  return { rows, result, third };
}
async function removeCategory(category) {
  const [rows] = await connection.query(dropColumn(category));
  const [result] = await connection.query(dropTable(category));
  return { rows, result };
}
async function getExamQuestions(mods) {
  const [rows] = await connection.query(examQuery(mods));
  rows.forEach((element, index) => {
    let arr = [
      {
        detail: element.answer,
        isAnswer: true,
        isSelected: false,
      },
      {
        detail: element.choiceone,
        isAnswer: false,
        isSelected: false,
      },
      {
        detail: element.choicetwo,
        isAnswer: false,
        isSelected: false,
      },
    ];
    if (
      !(
        element.choicethree === null ||
        element.choicethree === "null" ||
        element.choicethree === "undefined"
      )
    )
      arr.push({
        detail: element.choicethree,
        isAnswer: false,
        isSelected: false,
      });
    arr = shuffle(arr);
    element.selections = arr;
    delete element.answer;
    delete element.choiceone;
    delete element.choicetwo;
    delete element.choicethree;

    element.explanation = "The explanation";
    element.position = index + 1;
    element.isAttempted = false;
    element.isCorrect = false;
    element.isMarked = false;
  });
  return rows;
}
async function getQuestionsCount(requestObj) {
  let objKeys = [];
  let nums = 0;
  let appendage = "";
  Object.keys(requestObj).map((key) => {
    if (key === "start") return;
    return (objKeys[nums++] = key + " LIKE " + "'%" + requestObj[key] + "%'");
  });
  objKeys.forEach((val, index) => {
    if (index == objKeys.length - 1) {
      console.log("value called" + index);
      appendage += val;
      return;
    }
    appendage = appendage + val + " OR ";
  });
  if (objKeys.length > 0) appendage = " WHERE " + appendage;

  const [rows] = await connection.query(
    "SELECT COUNT(*) as count FROM questions" + appendage
  );
  return rows;
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
  removeCategory,
  getExamQuestions,
  getQuestionsCount,
};
