const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello World!");
});

var listener = app.listen(8080, () => {
    console.log("Listening on port " + listener.address().port);
});

app.post("/readPython", (req, res)=>{
    var dataToSend;
    const python = spawn('python', [path.join(__dirname, 'main.py')]);


    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        res.send(dataToSend)
    });
})