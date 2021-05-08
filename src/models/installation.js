const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type:String, required:true},
    area:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    }
})

module.exports = mongoose.model('Installation', installationSchema)