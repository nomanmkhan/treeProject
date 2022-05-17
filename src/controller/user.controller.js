
const User = require("../model/user.model");
const { generateAccessToken, validateRefreshToken } = require("../utils/authenticate")

module.exports.register = async (req, res) => {
    try {
        const { body } = req;
        let user = await User.findOne({ email: body.email });
        if (user) return res.status(409).json({ data: `User already exists with this email.` });
        user = new User(body);
        await user.save();
        await user.setHashedPassword();
        return res.status(200).json({ data: "Registration Successful!", user })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.login = async (req, res) => {
    try {
        const { body } = req;
        let user = await User.findOne({ email: body.email });
        if (!user) return res.status(403).json({ data: `Email or password is invalid` });
        let checkPassword = await user.compareHashedPassword(body.password);
        if (!user || !checkPassword) return res.status(403).json({ data: `Email or password is invalid` });
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
            return res.status(200).send({ data: { token: accessToken, user: data } });
        }
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}
