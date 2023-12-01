// Case 2: Translate from Traditional Mongolian Script to Cryllic.

const http = require("http");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

function sendingDataGenerator(translateText) {
  var data = new FormData();
  data.append("__EVENTTARGET", "ButtonTran_ID");
  data.append("__VIEWSTATEGENERATOR", "0CA142A3");
  data.append(
    "__VIEWSTATE",
    "/wEPDwUKLTU0MDgxNTc1MA9kFgICAw9kFgICAQ9kFgICDQ8PZBYCHgdvbmNsaWNrBTp0aGlzLnN0eWxlLmRpc3BsYXk9J25vbmUnO19fZG9Qb3N0QmFjaygnQnV0dG9uVHJhbl9JRCcsJycpZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WAgURQnV0dG9uVHJhbl9JREJhY2sFDUJ1dHRvblRyYW5fSUQGDwUE9cPGHkfHxLaRkbEgaHOy24VV4oA9wbZ5FgS1BA=="
  );
  data.append("inputCyrillic_ID", translateText);
  data.append(
    "__EVENTVALIDATION",
    "/wEdAAVUWO+Bh6HcoptvY4NweXM3Taw2keI+7zV+INMO8AHzSUHIbZyaqTF+z9onQgXSv3QGd75SsxXhlZrnKIv47ot/SFXHjTDBqsCa3dYPptywfRCbeLl7GSONZtwwpHNdiNaFFw5f99UPNT7TTOhkWt9j"
  );
  data.append("ButtonTran_ID.x", "98");
  data.append("ButtonTran_ID.y", "577");

  var config = {
    method: "post",
    url: "http://trans.mglip.com/ChineseT2C.aspx",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  return config;
}
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, "utf-8", function (err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}
function writeFiles(dirname, filename, content) {
  //console.log(sendingDataGenerator(content));
  axios(sendingDataGenerator(content))
    .then(function (response) {
      //console.log(response.data);
      const $ = cheerio.load(response.data);
      let myTranslatedText = $("#outPutTraditonalM_ID").text();
      console.log(myTranslatedText);
      fs.writeFile(dirname + "/" + filename, myTranslatedText, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Case 2: Translate from Traditional Mongolian Script to Cryllic");
    readFiles(
      "read_case2/",
      function (filename, content) {
        writeFiles("write_case2", filename, content);
      },
      function (err) {
        throw err;
      }
    );
  })
  .listen(8082);
