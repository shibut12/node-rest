const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
var port = process.env.PORT || 5000;

app.get('/api', (req, res)=> {
    res.json({
        message: 'welcome to the api'
    });
});

app.post('/api/posts', verifyToken, (req, res) =>{
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(401);
        }
        else{
            res.json({
                message: "Post request created",
                authData
            });
        }
    })
    
});

app.post('/api/login', (req, res)=> {
    //mock user
    const user = {
        id: 1,
        username: 'Shibu',
        email: 'shibu@mail.com'
    }
    jwt.sign({user: user}, 'secretkey', (err, token)=>{
        res.json({
            token
        });
    })
});

//Format of token
// Authorization: bearer <access_token>
//verify token
function verifyToken(req, res, next){
    // Get auth header val
    const bearerHeader = req.headers['authorization'];
    //check if bearer is null
    if(typeof bearerHeader !== 'undefined'){
        //split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //call next middleware
        next();
    }
    else{
        //forbidden
        res.sendStatus(401);
    }
}

app.listen(port, () => console.log('Server started on 5000'));