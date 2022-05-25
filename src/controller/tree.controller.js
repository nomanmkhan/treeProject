const Tree = require("../model/tree.model");
const { treeIdGenerator } = require("../utils/helper")
module.exports.addTree = async (req, res) => {
    try {
        const { body } = req;
        let count = await Tree.count()
        const treeId = await treeIdGenerator(count + 1);
        let data = {
            ...body,
            userId: req.user.id,
            id: treeId
        }
        let tree = await Tree.findOne({ lot: body.lot });
        if (tree) return res.status(200).json({ code: 0, data: `Tree already exists with this Lot#: ${body.lot} .` });
        tree = new Tree(data);
        await tree.save();
        return res.status(200).json({ code: 1, data: "Tree Added Successfully!", tree })
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
            ],
            isDelete: false
        }
        let trees = await Tree.find(filter).sort('-createdAt');
        return res.status(200).json({ code: 1, data: { trees } })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getOneTree = async (req, res) => {
    try {
        const { id } = req.params
        let tree = await Tree.findOne({ id });
        if (!tree) return res.status(200).send({ code: 0, data: `No Tree Found by this id: ${id}` })
        return res.status(200).json({ data: tree })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.updateTree = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        let tree = await Tree.findOneAndUpdate({ id }, body, { returnOriginal: false });
        if (!tree) return res.status(200).send({ code: 0, data: `No Tree Found by this id: ${id}` })
        return res.status(200).json({ code: 1, data: "Tree Updated Successfully" })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.deleteTree = async (req, res) => {
    try {
        const { id } = req.params
        let tree = await Tree.findOneAndUpdate({ id }, { isDelete: true }, { returnOriginal: false });
        if (!tree) return res.status(200).send({ code: 0, data: `No Tree Found by this id: ${id}` })
        return res.status(200).json({ code: 1, data: "Tree Deleted Successfully" })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.treesByUser = async (req, res) => {
    try {
        const { skip, perPage } = req.query;
        let filter = { userId: req.user.id, isDelete: false, addToWork: false }
        const count = await Tree.countDocuments(filter);
        let trees = await Tree.find(filter).sort('-createdAt')
        return res.status(200).json({ code: 1, data: { trees } })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}