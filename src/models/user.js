const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: { type: String, required:true},
    email: {type: String, required: true,unique:true},
    password: {type:String, required: true},
    status: { type:String, required: true, default:"Active"},
    designation: {type: String, required: true},
    userCode:{type:Number, required: true, unique: true},
    mobileNo:{type:Number, required: true, unique: true},
    // salaryCode: {type:Number, required: true},
    photo: {type:String, required:false },
    projects:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    notifications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    }],
    areaAndZone:[{
        area:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Area'
        },
        zones:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Zone'
        }]
    }]
    
})

module.exports = mongoose.model('User',userSchema)