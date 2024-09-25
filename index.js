const express = require('express');
const route = require('./controllers/userRoute');
const path = require('path');
// const cors = require('cors');
const session = require('express-session');
const port = 3000;
const server = express();

server.use(express.static(path.join(__dirname, 'public')))

server.set('views',path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use('/', route);

// const password = "password@1";
// var enc_password;

// bcrypt.genSalt(4, (err, Salt)=>{
//     bcrypt.hash(password, Salt, (err, hash)=>{
//         if(err){
//             return console.log('Cannot encrypt');
//         }
//         enc_password = hash;
//         console.log(hash);
//     })
// })

server.listen(port, ()=>{
    console.log(`Server Running on port:${port}...`)
})
