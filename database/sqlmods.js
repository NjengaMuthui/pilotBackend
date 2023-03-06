let select = "select";
let all = "*";
let from = "from";

function selectAll(table) {
  return select + " " + all + " " + from + " " + table;
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

module.exports = { selectAll, columnSelect };
