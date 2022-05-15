const Tree = require("../model/tree.model");
const { Pagination } = require('../utils/pagination')

module.exports.addTree = async (req, res) => {
    try {
        const { body } = req;
        let tree = await Tree.findOne({ lot: body.lot });
        if (tree) return res.status(409).json({ data: `Tree already exists with this Lot#: ${body.lot} .` });
        tree = new Tree(body);
        await tree.save();
        return res.status(200).json({ data: "Tree Added Successfully!", tree })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getTrees = async (req, res) => {
    try {
        const { street, zip, lot, skip, perPage } = req.query;
        let filter = {
            $and: [
                { lot: { $regex: lot } },
                { "address.nameOfStreet": { $regex: street } },
                { "address.zip": { $regex: zip } },
            ]
        }
        const count = await Tree.countDocuments(filter);
        let trees = await Tree.find(filter)
            .sort('-createdAt')
            .limit(parseInt(perPage))
            .skip(parseInt(skip * parseInt(perPage)));;
        let pagination = await Pagination(count, perPage, skip)
        return res.status(200).json({ pagination, trees, })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}