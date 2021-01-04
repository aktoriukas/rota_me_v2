const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const path = require('path');
const fs = require('fs')
const mysql = require('mysql')
const cors = require('cors');
const { resolve } = require('path');
const func = require('./func')

const db = mysql.createPool({
    host: 'localhost',
    user: 'home',
    password: 'namai',
    database: 'home'
})

app.use(express.json())
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}))

// app.get('/', (req, res) => {

//     // const sqlInsert = "INSERT INTO people (peopleName, peopleRole) VALUES ('Gediminas', 'boss');"

//     // db.query(sqlInsert, (err, result) => {
//     //     res.send('Hello world')

//     // })

// })

app.post('/api/insert', (req,res)=> {

    const name = req.body.name
    const role = req.body.role

    const sqlInsert = "INSERT INTO people (peopleName, peopleRole) VALUES (?, ?);"

    db.query(sqlInsert, [name, role], (err, result)=> {
        console.log(result)
    })
})
app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id
    // const sqlDel = "DELETE FROM people WHERE peopleName = ?"
    // db.query(sqlDel, name, (err, result) => {
    //     if (err) console.log(err)
    // })
    func.deleteAllEmployeeData(id, db)
    res.send()
})

app.put('/api/update', (req, res) => {
    const update = req.body.update;
    const insert = req.body.insert;

    func.insertShifts(insert, db);
    func.updateShifts(update, db);
    res.send()
})

app.get('/api/getPeople', (req,res) => {
    const sqlSelect = fs.readFileSync(path.join(__dirname, './sql/getPeople.sql')).toString();
    db.query(sqlSelect, (err, result)=> {
        res.send(result)
    })
})

app.get('/api/getShifts', (req,res) => {
    let query = JSON.parse(req.query.interval)
    let weekStart = query.weekBegining;
    let weekEnd = query.weekEnd;
    const sqlSelect = 
    `SELECT s.shiftsID, s.peopleID, s.startingTime, s.finishingTime, s.shiftsDate, p.peopleName, p.peopleRole
    FROM shifts s
    JOIN people p ON p.peopleID = s.peopleID 
    JOIN locations l ON s.locationsID = l.locationsID
    WHERE shiftsDate BETWEEN '${weekStart}' AND '${weekEnd}'`

    db.query(sqlSelect, (err, result)=> {
        res.send(result)
    })
})

app.listen(3001, () => {
    console.log(`running on port 3001`)
})