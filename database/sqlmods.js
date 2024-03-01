let select = "select";
let all = "*";
let from = "from";

function selectAll(table) {
  return select + " " + all + " " + from + " " + table;
}
function getQuestionsOnTopics(topics, request_query) {
  table = "questions";
  // select columns on the questions table
  let query =
    select +
    " " +
    table +
    ".ID," +
    table +
    ".question," +
    table +
    ".answer," +
    table +
    ".choiceone," +
    table +
    ".choicetwo," +
    table +
    ".choicethree," +
    table +
    ".level," +
    table +
    ".subject," +
    table +
    ".uuid";
  // create column queries for the variable question categories
  topics.length > 0 ? (query = query + ",") : (query = query + " ");

  topics.forEach((element, index) => {
    let lastIndex = topics.length - 1;
    query =
      query +
      element +
      ".ID as " +
      element +
      "ID, " +
      element +
      ".longname as " +
      element +
      "longname, " +
      element +
      ".shortname as " +
      element +
      "shortname";
    if (lastIndex > index) query = query + ",";
    else query = query + " ";
  });
  query = query + "from " + table + " ";
  topics.forEach(
    (element) =>
      (query =
        query +
        "left join " +
        element +
        " on " +
        element +
        ".ID = " +
        table +
        "." +
        element +
        " ")
  );
  let objKeys = [];
  let nums = 0;
  let appendage = "";
  Object.keys(request_query).map((key) => {
    if (key === "start") return;
    return (objKeys[nums++] =
      key + " LIKE " + "'%" + request_query[key] + "%'");
  });
  objKeys.forEach((val, index) => {
    if (index == objKeys.length - 1) {
      appendage += val;
      return;
    }
    appendage = appendage + val + " OR ";
  });
  if (objKeys.length > 0) appendage = " WHERE " + appendage;
  console.log(appendage + query + " LIMIT " + request_query.start + ",10");

  return query + appendage + " LIMIT " + request_query.start + ",10";
}

function columnSelect(table, ...column) {
  let col = " ";
  let close = column.length - 1;

  column.forEach((element, index) => {
    if (close > index) col = col + element + ",";
    else col = col + element + " ";
  });
  return select + col + from + " " + table;
}
function addColumn(columnName) {
  return (
    "alter table questions add column " + columnName + " int set default 1"
  );
}
function createTable(tableName) {
  return (
    "create table " +
    tableName +
    "(ID int not null auto_increment,longname varchar(50) not null, shortname varchar(50) not null,primary key(ID))"
  );
}
function insertDefault(tableName) {
  return (
    "insert into " + tableName + " (longname, shortname) values('n/a','n/a')"
  );
}
function dropColumn(columnName) {
  return "alter table questions drop column " + columnName;
}
function dropTable(tableName) {
  return "drop table " + tableName;
}
function examQuery(mods) {
  let query = columnSelect(
    "questions",
    "question",
    "answer",
    "choiceone",
    "choicetwo",
    "choicethree"
  );
  if (mods.category.length > 0) query = query + " where ";
  let last = mods.category.length - 1;
  mods.category.forEach((element, index) => {
    let ex = element.name + " = " + element.ID;
    if (last === index) query = query + ex + " ";
    else query = query + ex + " and ";
  });
  return query + " LIMIT 40";
}
/*
@param question in raw json format
@param array of columns to sort out

returns processed cartegories in an array as 
they are in their respective tables
*/
function processQuestions(questionJSON, topics) {
  questionJSON.forEach((element) => {
    let catJSON = JSON.parse('{ "category": [] }');

    topics.forEach((innerElement) => {
      let obj = {
        ID: element[innerElement + "ID"],
        shortname: element[innerElement + "shortname"],
        longname: element[innerElement + "longname"],
      };

      delete element[innerElement + "ID"];
      delete element[innerElement + "shortname"];
      delete element[innerElement + "longname"];

      catJSON.category.push(obj);
    });

    element["category"] = catJSON.category;
  });
  return questionJSON;
}
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

module.exports = {
  selectAll,
  columnSelect,
  getQuestionsOnTopics,
  processQuestions,
  addColumn,
  createTable,
  dropTable,
  dropColumn,
  insertDefault,
  examQuery,
  shuffle,
};
