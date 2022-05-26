
const User = require("../model/user.model");
const { generateAccessToken, validateRefreshToken } = require("../utils/authenticate")

module.exports.register = async (req, res) => {
    try {
        const { body } = req;
        let user = await User.findOne({ email: body.email });
        if (user) return res.status(200).json({ code: 0, data: `User already exists with this email.` });
        user = new User(body);
        await user.save();
        await user.setHashedPassword();
        return res.status(200).json({ code: 1, data: "Registration Successful!", user })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.login = async (req, res) => {
    try {
        const { body } = req;
        let user = await User.findOne({ email: body.email });
        if (!user) return res.status(200).json({ code: 0, data: `Email or password is invalid` });
        let checkPassword = await user.compareHashedPassword(body.password);
        if (!user || !checkPassword) return res.status(200).json({ code: 0, data: `Email or password is invalid` });
        if (checkPassword && user) {
            let data = {
                id: user.id,
                email: user.email,
                userType: user.userType
            }
            const accessToken = await generateAccessToken(data);
            // // const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
            // // user.refreshToken.push(refreshToken);
            // await user.save();
            return res.status(200).send({ code: 1, data: { token: accessToken, user: data } });
        }
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.userList = async (req, res) => {
    try {
        let user = await User.find({ userType: { $not: { $regex: "admin" } }, isDelete: false }).sort('-createdAt');
        if (user.length === 0) return res.status(200).send({ code: 0, data: "No user found" })
        return res.status(200).send({ code: 1, data: user });
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.delUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        let user = await User.findOne({ id });
        if (!user) return res.status(200).send({ code: 0, data: "No user found" })
        user.isDelete = true;
        await user.save();
        return res.status(200).send({ code: 1, data: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}
