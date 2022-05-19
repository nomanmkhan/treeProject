const jwt = require('jsonwebtoken');

module.exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token,authHeader);
    if (token === null) return res.status(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(400).send(err)
        }
        req.user = user;
        next();
    });

}
module.exports.generateAccessToken = (data) => {
    // return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
}