const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const { schemaOption } = require("../utils/schemaOptions");
const { type } = require('express/lib/response');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true
    },
    trees: [{ type: String }],
    userId: {
        type: String,
        required: true,
    },
    workerId: { type: String },
    image: { type: String },
    isComplete: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false }

}, schemaOption);

const model = mongoose.model("work", schema);
module.exports = model;