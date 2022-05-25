const mongoose = require("mongoose");
const { schemaOption } = require("../utils/schemaOptions")
const schema = new mongoose.Schema({
    treeCount: { type: String, default:"000" },
    workCount: { type: String, default:"000" },

}, schemaOption);
const model = mongoose.model("counter", schema);
module.exports = model;