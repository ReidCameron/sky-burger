const express = require ('express');
const ejs = require('ejs');
const serverless = require('serverless-http');
const app = express();
const path = require('path')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/',(req, res)=>{
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.listen(3000, ()=>{});
//serverless
const handler = serverless(app);
module.exports.handler = async (event, context) => {
    return await handler(event, context);
};