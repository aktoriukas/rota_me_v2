export const getStandartDate = (date) => {

    let standart = date.toISOString().slice(0, 10)
    
    return standart
}