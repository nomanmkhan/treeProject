const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const { schemaOption } = require("../utils/schemaOptions")

const schema = new mongoose.Schema({
    id: {
        type: String,
        default: () => {
            return uuidv4();
        },
        required: true,
        index: true
    },
    tree: { type: String, required: true },
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