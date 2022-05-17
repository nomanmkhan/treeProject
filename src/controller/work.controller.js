
const Work = require("../model/work.model");
const Tree = require("../model/tree.model");

module.exports.addWork = async (req, res) => {
    try {
        const { body } = req;
        const { user } = req;
        let data = {
            userId: user.id,
        }
        for await (let tree of body.trees) {
            let findTree = await Tree.findOne({ id: tree });
            if (findTree) {
                findTree.addToWork = true;
                data.tree = findTree.id;
                let work = await Work(data);
                work.save();
                findTree.save()
            }
        }
        return res.status(200).json({ data: "Work List Added Successful!" })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getWork = async (req, res) => {
    try {
        let filter = { isDelete: false, isComplete: false }
        let work = await Work.find(filter)
        if (work.length < 1) return res.status(404).send({ data: "No Record Found" });
        res.status(200).send({ data: work })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getWorkByUser = async (req, res) => {
    try {
        let filter = { userId: req.user.id, isDelete: false }
        let work = await Work.find(filter)
        if (work.length < 1) return res.status(404).send({ data: "No Record Found" });
        res.status(200).send({ data: work })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.params;
        let work = await Work.findOne({ id });
        if (!work) return res.status(404).send({ data: "no record found" });
        work.isDelete = true;
        let found = await Tree.findOne({ id: work.tree })
        if (!found) return
        found.addToWork = false;
        await work.save();
        await found.save();
        res.status(200).send({ data: "Record Deleted" })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
module.exports.updateWork = async (req, res) => {
    try {
        const { id } = req.params;
        let work = await Work.findOne({ id });
        work.isComplete = req.body.isComplete;
        work.workerId = req.user.id;
        let findTree = await Tree.findOne({ id: work.tree });
        findTree.image = `http://localhost:4000/image/${req.file.filename}`;
        findTree.isComplete = true;
        await work.save();
        await findTree.save();
        res.status(200).send({ data: "Record Updated" })

    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



