var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var status_schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

var Status = mongoose.model( "Status" , status_schema );
module.exports = Status;