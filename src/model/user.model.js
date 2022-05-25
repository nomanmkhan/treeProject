const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    userType: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type:String,
        required: true
    },
    isDelete: { type: Boolean, default: false },


}, schemaOption);

schema.methods.setHashedPassword = function () {
    var admin = this;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(admin.password, salt);
    admin.password = hashedPassword;
    admin.save();
}

schema.methods.compareHashedPassword = function (password) {
    try {
        const adminPassword = this.password;
        if (adminPassword) {
            const matchResult = bcrypt.compareSync(password, adminPassword);
            return matchResult;
        }
        else {
            return false;
        }

    } catch (err) {
        throw new Error("Error in matching hashed password")
    }


}

const model = mongoose.model("user", schema);
module.exports = model;