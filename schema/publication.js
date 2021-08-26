const mongoose = require('mongoose');

//create Author schema

const PublicationSchema = mongoose.Schema({
    id :{
        type:Number,
        required : true,
    },
    name:String,
    books : [String],
});

const PublicationModel = mongoose.model("publication",PublicationSchema);

module.exports=PublicationModel;