var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var comment_schema = new Schema({
    content: { type: String, required: true },
    status_id: { type: Schema.Types.ObjectId, ref: "Status" },
    username: { type: String, required: true }
})

var Comment = mongoose.model("Comment", comment_schema);

module.exports = Comment;