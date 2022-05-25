const moment = require('moment');
module.exports.treeIdGenerator = (count) => {
    if (count.toString().length === 1) return `T${moment().format("DDMMYYYY")}00${count}`
    if (count.toString().length === 2) return `T${moment().format("DDMMYYYY")}0${count}`
    if (count.toString().length === 3) return `T${moment().format("DDMMYYYY")}${count}`
}

module.exports.workIdGenerator = (count) => {
    if (count.toString().length === 1) return `W${moment().format("DDMMYYYY")}00${count}`
    if (count.toString().length === 2) return `W${moment().format("DDMMYYYY")}0${count}`
    if (count.toString().length === 3) return `W${moment().format("DDMMYYYY")}${count}`
}