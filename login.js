const express = require('express');
const bodyParser = require('body-parser');
const login = express();
const cors = require('cors');
login.use(bodyParser.json());
login.use(cors());
const path = require('path');
const db = require('./db')
const collection = "signIn";

login.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

//get
login.get('/getLogin', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err) {
            console.log(err);
        } else {
            console.log(documents);
            res.json(documents);
        }
    });
});

//put
login.put('/updateSignin/:id', (req, res) => {
    const todoId = req.params.id;
    const userInput = req.body;
    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(todoId) }, { $set: { todo: userInput.todo } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
});

//post
login.post('/postSignIn', (req, res) => {
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json({ result: result, document: result.ops[0] });
    })
});

//userValidation
login.post('/userVal', (req, res) => {
    const responseVal = req.body;
    db.getDB().collection(collection).findOne({userName: responseVal.userName, password: responseVal.password }, (err, documents) => {
        if (err) {
            console.log(err);
        } else {
            if (documents == null) {
                documents = 'Incorrect Username or Password';
            }
            res.json(documents);
        }
    });
});


//delete
login.delete('/deleteSignIn/:id', (req, res) => {
    const todoId = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(todoId) }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
});


db.connect((err) => {
    if (err) {
        console.log('error');
        process.exit(1);
    } else {
        login.listen(3000, () => {
            console.log('connected');
        });
    }
})