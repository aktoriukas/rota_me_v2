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
app.post('/api/insert/location', (req, res)=> {
    const name = req.body.name;

    const sqlInsert = `INSERT INTO locations (location) VALUES ('${name}');`
    db.query(sqlInsert, (err, result) => {
        if(err) console.log(err)
    })
    res.send()
})
app.post('/api/insert/people', (req,res)=> {

    const name = req.body.name
    const role = req.body.role

    const sqlInsert = "INSERT INTO people (peopleName, peopleRole) VALUES (?, ?);"

    db.query(sqlInsert, [name, role], (err, result)=> {
        if(err) console.log(err)
    })
})
app.delete('/api/delete/employee/:id', (req, res) => {
    const id = req.params.id
    func.deleteAllEmployeeData(id, db)
    res.send()
})
app.delete('/api/delete/location/:id', (req,res) => {
    const id = req.params.id
    func.deleteLocation(id, db)
    res.send()
})
app.put('/api/update', (req, res) => {
    const update = req.body.update;
    const insert = req.body.insert;

    func.insertShifts(insert, db);
    func.updateShifts(update, db);
    res.send()
})
app.get('/api/getLocations', (req, res) => {
    const sqlSelect = fs.readFileSync(path.join(__dirname, './sql/getLocations.sql')).toString();
    db.query(sqlSelect, (err, result)=> {
        res.send(result)
    })
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
    `SELECT l.location, l.locationsID,  s.shiftsID, s.peopleID, s.startingTime, s.finishingTime, s.shiftsDate, p.peopleName, p.peopleRole
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