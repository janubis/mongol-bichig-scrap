const http = require("http");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

function sendingDataGenerator(translateText) {
  var data = new FormData();
  data.append("__EVENTTARGET", "ButtonTran_ID");
  data.append("__VIEWSTATEGENERATOR", "37EAF2C1");
  data.append(
    "__VIEWSTATE",
    "/wEPDwUKLTUyNDYzNDUxMg9kFgICAw9kFgICAQ9kFgQCCw8PFgIeBFRleHQFI+GguuGgouGgt+GgouGgryDhoK7hoKPhoKnhoK3hoKPhoK8gZGQCEA8PZBYCHgdvbmNsaWNrBTp0aGlzLnN0eWxlLmRpc3BsYXk9J25vbmUnO19fZG9Qb3N0QmFjaygnQnV0dG9uVHJhbl9JRCcsJycpZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WAgURQnV0dG9uVHJhbl9JREJhY2sFDUJ1dHRvblRyYW5fSUR9LrII9WwHWhCJS2rxR11t2h4YGeD5992b6LrRBq4COw=="
  );
  data.append("inputCyrillic_ID", translateText);
  data.append(
    "__EVENTVALIDATION",
    "/wEdAAS0QQN87QPXK2Cp61whLiHWTaw2keI+7zV+INMO8AHzSQZ3vlKzFeGVmucoi/jui39IVceNMMGqwJrd1g+m3LB9ihX8AsL4qXIxQ6FAv+KIpZ5qEtV2Ldz3AeDkNF9Bz30="
  );
  data.append("ButtonTran_ID.x", "98");
  data.append("ButtonTran_ID.y", "577");

  var config = {
    method: "post",
    url: "http://trans.mglip.com/EnglishC2T.aspx",
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
      fs.writeFile(dirname+"/"+filename, myTranslatedText, function(err) {
        if(err) {
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
    res.end("Hello World!");
    readFiles(
      "read/",
      function (filename, content) {
        writeFiles("write", filename, content);
      },
      function (err) {
        throw err;
      }
    );
  })
  .listen(8080);
