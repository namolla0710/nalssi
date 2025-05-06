const express = require('express');
const app = express();
const port = 4357;

var bodyParser = require('body-parser');
  
const axios = require("axios");

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(express.static(__dirname + "/tem/static"))
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/tem/index.html");
})

app.post('/getData', (req, res) => {
  console.log(req.body)

  const x = req.body.x;
  const y = req.body.y;

  const year = req.body.year;
  const month = req.body.month;
  const day = req.body.day;
  const hour = req.body.hour;
  const min = req.body.min;
  requestNalssi(year, month, day, hour, min, x, y, res);
})

function requestNalssi(year, month, day, hour, min, x, y, res){
  var date = String(year).padStart(4, "0") + String(month).padStart(2, "0") + String(day).padStart(2, "0");
  min = Number(min) - 1;
  if(min < 0){
    min = 5
    hour--;
  }
  var time = String(hour).padStart(2, "0") + String(Math.floor(min)).padEnd(2, "0");
  console.log(String(Math.floor(min)).padEnd(2, "0"), time)

  var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';


  axios.get(url, {
    params: {
      serviceKey: 'HTYEX8TzfOhfIF4IZVtuOMkwVOn/keASj8phfIrl6ckqqYuDr8diWCoXsPRFQvvV3IRJeXvt/wUVca+nRUgiDQ==',
      pageNo: '1',
      numOfRows: '1000',
      dataType: 'JSON',
      base_date: date,
      base_time: time,
      nx: String(x),
      ny: String(y)
    }
  })
  .then(response => {
    res.json(JSON.parse(response.data));
  })
  .catch(error => {
    console.error(error);
  });
}

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
})