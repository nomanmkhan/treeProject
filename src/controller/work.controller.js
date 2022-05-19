
const Work = require("../model/work.model");
const Tree = require("../model/tree.model");

module.exports.addWork = async (req, res) => {
    try {
        const { body } = req;
        const { user } = req;
        let data = {
            ...body,
            userId: user.id,
        }
        let work = await Work(data);
        work.save()
        for await (let tree of data.trees) {
            let found = await Tree.findOne({id: tree})
            if(found){
                found.addToWork = true;
                found.save()
            }
        }
        return res.status(200).json({code:1, data: "Work List Added Successful!", work })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



