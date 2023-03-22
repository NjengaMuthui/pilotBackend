let select = "select";
let all = "*";
let from = "from";

function selectAll(table) {
  return select + " " + all + " " + from + " " + table;
}
function getQuestionsOnTopics(topics) {
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
    ".choicethree,";

  // create column queries for the variable question categories

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
  return query;
}

function columnSelect(table, ...column) {
  let col = " (";
  let close = column.length - 1;

  column.forEach((element, index) => {
    if (close > index) col = col + element + ",";
    else col = col + element + ") ";
  });
  return select + col + from + " " + table;
}
function addColumn(columnName) {
  return "alter table questions add column " + columnName + " int not null";
}
function createTable(tableName) {
  return (
    "create table " +
    tableName +
    "(ID int not null auto_increment,longname varchar(50) not null, shortname varchar(50) not null,primary key(ID))"
  );
}
function dropColumn(columnName) {
  return "alter table questions drop column " + columnName;
}
function dropTable(tableName) {
  return "drop table " + tableName;
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
        longname: element[innerElement + "longname"]
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

module.exports = {
  selectAll,
  columnSelect,
  getQuestionsOnTopics,
  processQuestions,
  addColumn,
  createTable,
  dropTable,
  dropColumn
};
