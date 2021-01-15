import { convertToMinutes, calculateTotal } from './Calculations';


export const getStandartDate = (date) => {

    let standart = date.toISOString().slice(0, 10)
    
    return standart
}

export const makeSqlDate = (date) => {

    const pad = function(num) { return ('00'+num).slice(-2) };
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())

}
export const getAllTotal = (people) => {

    let total = 0;
    let startingTime, finishingTime, dayTotal
    people.forEach(person => {
        person.weekDays.forEach(day => {
            startingTime = convertToMinutes(day.startingTime)
            finishingTime = convertToMinutes(day.finishingTime)
            dayTotal = calculateTotal(startingTime, finishingTime) 
            total += dayTotal
        })
    });
    return total
}
export const  getUpdatedShifts = (shift, people, id) => {

    let updatedPeople = [...people].map(person => {
        if ( person.peopleID === shift.peopleID) {
            person.weekDays[shift.weekDay] = {};
            person.weekDays[shift.weekDay] = {
                startingTime: shift.startingTime,
                finishingTime: shift.finishingTime,
                date: shift.date,
                locationID: shift.locationID,
                shiftID: shift.shiftID,
                userID: id,
                shiftBreak: shift.shiftBreal
            }
        }
        return person
    })
    return updatedPeople
}