const mongoose = require("mongoose")

const idSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id:{
        type:String,
        required: true,
        unique: true
    },
    projectId:String
})

module.exports = mongoose.model('Id',idSchema)