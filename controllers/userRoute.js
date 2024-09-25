const express = require('express');
const bcrypt = require('bcryptjs'); 
const dbConnection = require('../models/dbconnection');
const {validationRate, validationResult} = require('express-validator');
const route = express.Router();

route.get('/index', async(req,res,next)=>{
    res.render('index');
})

route.get('/', (req,res)=>{
    res.render('login');
});
route.post('/', async (req, res, next)=>{
    const errors = validationResult(req);
    const {body} = req;
    
    if(!errors.isEmpty()){
        return res.render('/', {error:errors.array()[0].msg});
    }
    try {
        const sql = 'SELECT * FROM `users_tbl` WHERE `username` = ?';
        const [rows] = await dbConnection.execute(sql, [body._username]);

        if(rows.length !=1){
            return res.render('/', {error: 'Invalid Username'});
        }

        const checkPassword = await bcrypt.compare(body._password, rows[0].password);

        if(checkPassword === true){
            return res.redirect('/index');
        }

        res.render('/', {error: 'Invalid Password...'})
    } catch (error) {
        next(error);
    }
})


route.get('/reg', (req,res)=>{
    res.render('reg');
});

route.post('/signup', async(req,res,next)=>{
    const errors = validationResult(req);
    const {body} = req;
    
    if(!errors.isEmpty()){
        return res.render('reg', {
            error: errors.array()[0].msg
        });
    }

    //Check Password Authenticity
    if(body._password !== body._confirm_password){
        return res.render('reg', {error: 'Password Does Not Match'})
    }else{
        try {
            //Check If the username or email already exists 
            let sqlcheck = 'SELECT * FROM `users_tbl` WHERE `username` = ?'
            const [record] = await dbConnection.execute(sqlcheck, [body._username]);
            if(record.length >=1){
                return res.render('reg', {error: 'Username Taken'});
            }

            // Check the database table for a user with a given username or email already existing
            const hash = await bcrypt.hash(body._password, 9);
            const addRec = "INSERT INTO `users_tbl`(`username`,`email`,`password`) VALUES (?,?,?)";
            const [rows] = await dbConnection.execute(addRec, [body._username, body._email, hash]);

            if(rows.affectedRows !== 1){
                return res.render('reg', {error: 'Registration Failed.'});
            }

            res.render('reg', {msg: 'Registration Successful.'});
        } catch (error) {
            next(error);
        }
    }
    
})
module.exports = route;