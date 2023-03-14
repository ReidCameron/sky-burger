const { Console } = require('console');
const express = require ('express');
const ejs = require('ejs');
// const serverless = require('serverless-http');
const app = express();
const path = require('path')

app.set('view engine', 'ejs');
app.use(express.static('public'));

// app.set('views', path.join(__dirname, './public/views'));

app.use('/',(req, res)=>{
    res.render('index');
})
app.listen(3000, ()=>{
    console.log("listening on port 3000")
})
//serverless
// const handler = serverless(app);
// module.exports.handler = async (event, context) => {
    // return await handler(event, context);
// };