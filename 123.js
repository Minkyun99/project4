const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const logger = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(history());

require("dotenv").config();
const port = 3000;
const _path = path.join(__dirname, "./dist");
console.log(_path);

app.use("/", express.static(_path));
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Photo = require("./photo.js");
const { url } = require("inspector");

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
  })
);

app.post("/about", function (req, res) {
  // front 서버에서 post 방식으로 전송받음
  const A = req.body.name;
  console.log(A);

  const main = async () => {
    const _data = {
      url: A,
    };
    console.log("왔냐");
    console.log(req.body);
    console.log("왔냐2");
    const new_photo = new Photo(_data);
    const t = await new_photo.save();
  };

  main();
});

/*파파고 번역*/
app.use("/", express.static(_path));
app.use(logger("tiny"));

const NAVER_CLIENT_ID = process.env.ID;
const NAVER_CLIENT_SECRET = process.env.SECRET;

let api_url = "https://openapi.naver.com/v1/papago/n2mt";

const request = require("request");

io.on("connection", (socket) => {
  socket.on("trans", (msg) => {
    let options = {
      url: api_url,
      form: { source: "en", target: "ko", text: msg },
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const rst = JSON.parse(body);
        io.emit("trans", rst.message.result.translatedText);
        console.log(rst.message.result.translatedText);
      } else {
        console.log("error = " + response.statusCode);
      }
    });
  });
});

server.listen(port, () => {
  console.log(port + "에서 서버동작 완료.");
});
