var readFileFn = require("./src/file-handler").readFile;
var readCellArray = require("./src/file-handler").readFromCellAsArray;
var path = require("path");
var minimist = require("minimist");
var _ = require("lodash");
var fs = require("fs");

var argv = minimist(process.argv.slice(2));
var filename = argv.i || argv.input;
var sheet = argv.s || argv.sheet;
var languages = (argv.l || argv.languages).split(" ");
var outputFilename = argv.f || argv.filename;
var outputDirectory = argv.o || argv.output;

console.log("Reading from: " + filename);
var file = readFileFn(filename);
var workSheet = file.Sheets[sheet];
var result = readCellArray(workSheet, "B1", "E1000", languages);

function isObject(object) {
  return object && typeof object === "object" && !Array.isArray(object);
}
var _array;
function assignArrayToKeys(obj, array) {
  _array = array;
  Object.keys(obj)
    .sort()
    .forEach(key => {
      if (isObject(obj[key])) {
        obj[key] = assignArrayToKeys(obj[key], _array);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index, arr) => {
          arr[index] = assignArrayToKeys(item, _array);
        });
      } else {
        obj[key] = _.first(_array);
        _array = _array.slice(1);
      }
    });
  return obj;
}

function _writeObjectToJson(obj, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}

_.forEach(languages, language => {
  var jsonObject = JSON.parse(
    fs.readFileSync(
      path.join(outputDirectory, "/", language, "/", outputFilename)
    )
  );
  var translatedObject = assignArrayToKeys(jsonObject, result[language]);
  _writeObjectToJson(
    translatedObject,
    path.join(outputDirectory, "/", language, "/", outputFilename)
  );
  console.log(language, translatedObject);
});
