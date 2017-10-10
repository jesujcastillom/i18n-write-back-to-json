var XLSX = require("xlsx");
var _ = require("lodash");

function readFile(filename) {
  return XLSX.readFile(filename);
}

function readFromCellAsArray(workSheet, fromCell, toCell, languagesColumns) {
  var objects = XLSX.utils.sheet_to_json(workSheet, {
    range: fromCell + ":" + toCell,
    raw: true
  });
  var languages = {};
  _.forEach(objects, item => {
    Object.keys(item).forEach((key, index) => {
      var languageIndex = languages[languagesColumns[index]];
      if (languageIndex) {
        languageIndex.push(item[key]);
      } else {
        languages[languagesColumns[index]] = [item[key]];
      }
    });
  });
  return languages;
}

module.exports = {
  readFromCellAsArray,
  readFile
};
