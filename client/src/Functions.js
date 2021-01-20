import { convertToMinutes, calculateTotal } from './Calculations';


export const getStandartDate = (date) => {

    let standart = date.toISOString().slice(0, 10)

    return standart
}

export const makeSqlDate = (date) => {

    const pad = function (num) { return ('00' + num).slice(-2) };
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())

}
export const getAllTotal = (people) => {

    let total = 0;
    let startingTime, finishingTime, dayTotal
    people.forEach(person => {
        person.weekDays.forEach(day => {
            if (startingTime !== undefined && finishingTime !== undefined) {
                startingTime = convertToMinutes(day.startingTime)
                finishingTime = convertToMinutes(day.finishingTime)
                dayTotal = calculateTotal(startingTime, finishingTime)
                total += dayTotal
            }
        })
    });
    return total
}
export const getUpdatedShifts = (shift, people, id) => {

    let updatedPeople = [...people].map(person => {
        if (person.peopleID === shift.peopleID) {
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
export const addHolidays = (people, holidays, monday, sunday) => {

    holidays.forEach(item => {
        let jsDateStart = new Date(Date.parse(item.holidaysStartDate))
        let jsDateEnd = new Date(Date.parse(item.holidaysEndDate))
        let weekStart = jsDateStart.getDay() - 1
        let weekEnd = jsDateEnd.getDay() - 1
        if (weekEnd === -1) weekEnd = 6
        console.log(people)

        people.forEach(person => {
            if (person.peopleID === item.holidaysPeopleID) {
                for (let i = 0; i < 7; i++) {

                    if (jsDateStart >= monday && jsDateEnd <= sunday) {

                        // full holidays within this week

                        if (i <= weekEnd && i >= weekStart) {
                            person.holidays[i] = true
                            continue
                        }

                    } else if (jsDateStart >= monday) {

                        // holidays starts this week

                        if (i >= weekStart) {
                            person.holidays[i] = true
                            continue
                        }

                    } else if (jsDateEnd <= sunday) {

                        // holidays ends this week

                        if (i <= weekEnd) {
                            person.holidays[i] = true
                            continue
                        }
                    }
                }
            }
        })
    })
}
export const resetDateTime = time => {
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time
}