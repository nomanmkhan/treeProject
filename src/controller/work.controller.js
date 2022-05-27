const Work = require("../model/work.model");
const Tree = require("../model/tree.model");
const User = require("../model/user.model");
const { workIdGenerator } = require("../utils/helper")

module.exports.addWork = async (req, res) => {
    try {
        const { body } = req;
        const { user } = req;
        let count = await Work.count()
        const workId = await workIdGenerator(count + 1);
        let unique = await Work.find();
        for await (let tree of body.trees) {
            for (let i = 0; i < unique.length; i++) {
                if (unique[i].trees.includes(tree)) {
                    if (unique[i].isDelete === false) {
                        return res.status(200).send({ code: 0, data: `Tree: ${tree} already added in work` })
                    }
                }
            }
        }
        for await (let treeSave of body.trees) {
            let singleTree = await Tree.findOne({ id: treeSave });
            singleTree.addToWork = true;
            await singleTree.save();
        }
        let data = {
            userId: user.id,
            id: workId,
            trees: body.trees
        }
        let work = await Work(data);
        await work.save();
        return res.status(200).json({ code: 1, data: "Work List Added Successful!" })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getWork = async (req, res) => {
    try {
        let filter = { isDelete: false, isComplete: false }
        // let work = await Work.find(filter)
        let newWork = await Work.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "userId",
                    foreignField: "id",
                    as: "userDetail"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    trees:1,
                    isComplete:1,
                    isDelete:1,
                    image:1,
                    workerId:1,
                    createdAt: 1,
                    updatedAt: 1,
                    userId: 1,
                    "userEmail": { $arrayElemAt: [ "$userDetail.email", 0 ] },
                }
            }
        ]).sort('-createdAt');
        if (newWork.length < 1) return res.status(200).send({ code: 0, data: "No Record Found" });
        res.status(200).send({ code: 1, data: newWork })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getWorkByUser = async (req, res) => {
    try {
        let filter = { userId: req.user.id, isDelete: false }
        let work = await Work.find(filter)
        if (work.length < 1) return res.status(200).send({ code: 0, data: "No Record Found" });
        res.status(200).send({ code: 1, data: work })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.params;
        let work = await Work.findOne({ id });
        if (!work) return res.status(200).send({ code: 0, data: "no record found" });
        work.isDelete = true;
        for (let i = 0; i < work.trees.length; i++) {
            let found = await Tree.findOne({ id: work.trees[i] })
            if (found) {
                found.addToWork = false;
                found.isImage = false;
                await found.save();
            }
        }
        await work.save();
        res.status(200).send({ code: 1, data: "Record Deleted" })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.updateWork = async (req, res) => {
    try {
        const { id } = req.params;
        let work = await Work.findOne({ id });
        work.isComplete = req.body.isComplete ? true : false;
        work.workerId = req.user.id;
        if (req.file) { work.image = `http://localhost:4000/image/${req.file.filename}`; }
        for await (let tree of work.trees) {
            let findTree = await Tree.findOne({ id: tree });
            if (findTree) {
                if (req.file) { findTree.isImage = true }
                findTree.isComplete = req.body.isComplete ? true : false;
                await findTree.save()
            }
        }
        await work.save();
        res.status(200).send({ code: 1, data: "Record Updated" })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getWorkbyId = async (req, res) => {
    try {
        const { id } = req.params;
        let work = await Work.findOne({ id });
        if (!work) return res.status(200).send({ code: 0, data: "no record found" });
        res.status(200).send({ code: 1, data: work })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.updateWorkbyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { trees } = req.body;
        let work = await Work.find();
        for await (let tree of trees) {
            for (let i = 0; i < work.length; i++) {
                if (work[i].trees.includes(tree)) {
                    if (work[i].isDelete === false && work[i].id !== id) {
                        return res.status(200).send({ code: 0, data: `Tree: ${tree} already added in work` })
                    }
                }
            }
        }
        let updateWork = await Work.findOne({ id })
        for (let i = 0; i < updateWork.trees.length; i++) {
            let singleTree = await Tree.findOne({ id: updateWork.trees[i] })
            if (singleTree) {
                singleTree.addToWork = false;
                singleTree.isImage = false;
                await singleTree.save()
            }
        }

        for await (let treeSave of trees) {
            let t = await Tree.findOne({ id: treeSave })
            if (t) {
                t.addToWork = true
                await t.save()
            }
        }

        updateWork.trees = trees;
        await updateWork.save();
        res.status(200).send({ code: 1, data: "Record Updated" })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}