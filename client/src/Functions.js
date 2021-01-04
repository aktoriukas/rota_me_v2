export const getStandartDate = (date) => {

    let standart = date.toISOString().slice(0, 10)
    
    return standart
}

export const makeSqlDate = (date) => {

    const pad = function(num) { return ('00'+num).slice(-2) };
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())

}