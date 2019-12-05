const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
const db = require('./db')
const collection = "todo";
const nodemailer = require('nodemailer');
const cors = require('cors');
app.use(cors());

app.post('/sendmail', (req, res) => {
    const userInput = req.body;
    console.log(userInput)
    var a = sendmail(userInput);
    if (a) {
        console.log('test')
        res.json({ success: 'Mail Sent Successfully' });
    }
});

function sendmail(user, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sundev1987@gmail.com',
            pass: 'Mathi*2627'
        }
    });
    transporter.sendMail({
        from: "sundev1987@gmail.com",
        to: user.email,
        subject: "Welcome",
        text: '<h1> Hi ${user.name}<h1>',
        attachments: [{
            filename: 'qajso.txt',
            path: 'C:/Users/auxouser/Desktop/qajso.txt',
            contentType: 'text/plain'
          }],
    });
    return true;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

//get
app.get('/getTodos', (req, res) => {
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
app.put('/putTods/:id', (req, res) => {
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
app.post('/postTodos', (req, res) => {
    const userInput = req.body;
    db.getDB().collection(collection).insert(userInput, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json({ success: true, documents: result.ops[0] });
    })
});

//delete
app.delete('/deleteTodos/:id', (req, res) => {
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
        app.listen(3000, () => {
            console.log('connected');
        });
    }
})