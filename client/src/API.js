import { makeSqlDate } from './Functions';

export const GetPeople =  (Axios, link, id) => {
    return new Promise(resolve => {
        let newPeople;
        const userID = {
            userID: id
        }
        Axios.get(`${link}/api/getPeople`, { params: { userID } })
        .then(response => {
            newPeople = [...response.data];
            newPeople.map((item) => item.weekDays = []);
          resolve(newPeople)
        })
    })
}
export const GetShifts = (Axios, link, id, start, end) => {
    return new Promise(resolve => {
  
        let interval = {
            weekBegining: start,
            weekEnd : end,
            userID: id  
        }
        Axios.get(`${link}/api/getShifts`, { params: {interval} })
        .then((response)=> {
            let shift = [...response.data]
            resolve(shift)
        })
    });
};
export const GetLocations = (Axios, link, id) => {

    return new Promise(resolve => {
        const userID = {
            userID: id
        }
        Axios.get(`${link}/api/getLocations`, { params: { userID } })
        .then( response => {
            resolve(response.data)
        })
    
    })
}
export const GetNotes = (Axios, link, id, start, end) => {
    return new Promise(resolve => {
        let interval = {
            weekBegining: start,
            weekEnd : end,
            userID: id  
        }
        Axios.get(`${link}/api/getNotes`, { params: {interval} })
        .then((response)=> {
            let notes = [...response.data]
            resolve(notes)
        })
    })
}
export const SavePerson = (Axios, link, id, name, role) => {

    return new Promise(resolve => {
        
        if( name === undefined || role === undefined ) {
            resolve (2)
        }
        if(!/[^a-z]/i.test(name) && !/[^a-z]/i.test(role)) {
            
            if(name.length !== 0 || role.length !== 0) {
                Axios.post(`${link}/api/insert/people`,
                {name: name, role: role, userID: id}).then(() => {
                    resolve(0)
                })  
            }else { resolve(1) }
        }else { resolve(2) }
    })
}
export const SaveLocation = (Axios, link, id, name) => {

    return new Promise(resolve => {

        if (name !== '' && name !== undefined) {

            if(!/[^a-z]/i.test(name) ) {

                Axios.post(`${link}/api/insert/location`,
                {name: name, userID: id}).then(() => {
                    resolve(0)
                })        
            }else{ resolve (2) }
        }else { resolve(1) }
    })
}
export const SaveDatatoDB = (Axios, link, id, state) => {

    return new Promise((resolve, reject) => {

        const { userAccess, people, notes } = state
        let update = [];
        let insert = [];
        let insertNotes = [];
        let updateNotes = [];
        if(userAccess === 1){
            people.forEach(person => {
                person.weekDays.forEach(day => {
                    let shift = {}
                    let sqlDate = makeSqlDate(day.date)
                    shift = {
                        peopleID: person.peopleID,
                        startingTime: day.startingTime,
                        finishingTime: day.finishingTime,
                        date: sqlDate,
                        locationID: day.locationID,
                        userID: id
                    }
                    if ( day.shiftID === undefined) {
                        insert.push(shift)
                    } else {
                        shift.shiftID = day.shiftID
                        update.push(shift)
                    }
                })
            })
            notes.forEach(note => {
                if(note === undefined) return
                let newNote = {}
                let sqlDate = makeSqlDate(note.notesDate)
                newNote = {
                    notesText: note.notesText,
                    usersID: id,
                    notesDate: sqlDate
                }
                if ( note.notesID === undefined) {
                    insertNotes.push(newNote)
                } else {
                    newNote.notesID = note.notesID
                    updateNotes.push(newNote)
                }
            })
            Axios.put(`${link}/api/update`, {
                update: update,
                insert: insert,
                updateNotes: updateNotes,
                insertNotes: insertNotes
            }).then(() =>  resolve('Data been saved') )
        }else {
            resolve('You not allowed this action')
        }
    })
}
