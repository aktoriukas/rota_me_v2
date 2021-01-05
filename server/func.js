const insertShifts = (insert, db) => {
    const sqlInsert = 
    `INSERT INTO shifts (peopleID, startingTime, finishingTime, shiftsDate, locationsID) 
     VALUES (?,?,?,?,?);`

    insert.forEach(shift => {

        db.query(sqlInsert, [shift.peopleID, shift.startingTime, shift.finishingTime, shift.date, shift.locationID], (err, result) => {
            if (err) console.log(err)
        })
    });
}
const updateShifts = (update, db) => {
    update.forEach(shift => {

        const sqlUpdate = 
            `UPDATE shifts SET startingTime = ?, finishingTime = ?, locationsID =? 
             WHERE (shiftsID ='${shift.shiftID}');`;
        db.query(sqlUpdate, [shift.startingTime, shift.finishingTime, shift.locationID], (err, result) => {
            if (err) console.log(err)
        })
        
    })
}
const deleteAllEmployeeData = (id, db) => {
        const sqlDelShifts = `DELETE FROM shifts WHERE peopleID = '${id}';`
        db.query(sqlDelShifts, (err, result) => {
            if(err) console.log(err)
        })

        const sqlDelPeron = `DELETE FROM people WHERE peopleID = '${id}';`
        db.query(sqlDelPeron, (err, result) => {
            if(err) console.log(err)
        })
}
const deleteLocation = (id, db) => {
    const sqlDelShifts = `DELETE FROM shifts WHERE locationsID = '${id}';`
    db.query(sqlDelShifts, (err, result) => {
        if(err) console.log(err)
    })
    const sqlDelPeron = `DELETE FROM locations WHERE locationsID = '${id}';`
    db.query(sqlDelPeron, (err, result) => {
        if(err) console.log(err)
    })
}

module.exports = { deleteLocation, insertShifts, updateShifts, deleteAllEmployeeData }