var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");



var user_schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    statuses: [ { type: Schema.Types.ObjectId, ref: "Status" } ],
    following: [ { type: Schema.Types.ObjectId, ref: "User" } ],
    followers: [ { type: Schema.Types.ObjectId, ref: "User" } ]
})

user_schema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

user_schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

var User = mongoose.model( "User" , user_schema );
module.exports = User;