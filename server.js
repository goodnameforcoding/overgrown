var express = require('express');
var app = express();
const port = 80;

//app.get('/', (req, res) => {
//});
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
