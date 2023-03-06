const connection = require("./sqlconnection");

async function queryDB(query) {
  const [rows] = await connection.query(query);
  return rows;
}

async function insertQuestion(Q) {
  const [rows] = await connection.query(
    "insert into questions (question,answer,choiceone,choicetwo,choicethree,topic,subtopic,unit) values(?,?,?,?,?,?,?,?)",
    [
      Q.question,
      Q.answer,
      Q.choiceone,
      Q.choicetwo,
      Q.choicethree,
      Q.topic,
      Q.subtopic,
      Q.unit
    ]
  );
  return rows;
}
async function updateQuestion(Q) {
  const [rows] = await connection.query(
    "update questions set question=?, set answer=?,set choiceone=?,set choicetwo=?,set choicethree=?,set topic=?,set subtopic=?,set unit=? where ID=?",
    [
      Q.question,
      Q.answer,
      Q.choiceone,
      Q.choicetwo,
      Q.choicethree,
      Q.topic,
      Q.subtopic,
      Q.unit,
      Q.ID
    ]
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

module.exports = {
  queryDB,
  insertTopic,
  updateTopic,
  deleteTopic,
  insertQuestion,
  updateQuestion,
  deleteQuestion
};
