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
    type: {
        type: String,
        required: true,
        lowercase: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    address: {
        nameOfStreet: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    lot: {
        type: String,
        required: true,
        trim: true
    },
    isComplete: {type: Boolean, default: false}

}, schemaOption);

const model = mongoose.model("tree", schema);
module.exports = model;