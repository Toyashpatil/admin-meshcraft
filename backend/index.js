const express = require("express");
const app = express();
const connectTOMongo= require('./db');
const cors = require("cors");

app.use(express.json());
app.use(cors());



const PORT = 5000;

connectTOMongo();

app.use('/auth',require('./routes/auth'));
app.use('/assets',require('./routes/assets'));
app.use('/threeModel',require('./routes/threeModel'));
app.use('/thumbnail', require('./routes/thumbnail'));



app.get('/', (req, res) => {
    res.send('Hello')
})
// app.get('/getIp',(req,res)=>{
//     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

//     console.log(ip);
//     res.json({
//         ip:ip
//     })
// })

app.listen(PORT,()=>{
    console.log("Server started PORT : " + PORT);
})