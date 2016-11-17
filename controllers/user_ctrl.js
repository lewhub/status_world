var User = require("../models/user.js");
var Status = require("../models/status.js");
var jwt = require("jsonwebtoken");

module.exports = {
    index: function(req, res) {
        User
            .find( { } )
            .populate("statuses")
            .exec( function(err, users) {
                if (err) return console.log(err)
                res.json( { success: true, message: "All Users in DB...",  users: users } )
            } )
    },
    show: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .populate("statuses")
            .exec( function(err, user) {
                if (err) return console.log(err)
                res.json( { success: true, message: "User Found...", user: user } )
            } )
    },
    create: function(req, res) {
        var new_user = new User( req.body );
        new_user.password = new_user.generateHash(req.body.password);
        new_user.save( function(err, user) {
            if (err) return console.log(err)
            var token = jwt.sign(user.toObject(), process.env.secret, {
                expiresIn: 3000
            })
            res.json( { success: true, message: "New User Created...", user: user, token: token } )
        } )
    },
    login: function(req, res){
        User
            .findOne( { email: req.body.email } )
            .exec( function(err, user) {
                if (err) return console.log(err)
                if (!user) return res.json( { success: false, message: "no user found with email provided." } )
                if (user && !user.validPassword(req.body.password)) return res.json( { success: false, message: "invalid password." } )
                var token = jwt.sign(user.toObject(), process.env.secret, {
                    expiresIn: 1440
                })
                res.json( { success: true, message: "login successful.", token: token, user: user } );
            })
    },
    verify_access: function(req, res, next) {
        console.log(req.method, "req method")
        if (req.method === "GET"){
            next()
        } else {
            var token = req.body.token || req.query.token || req.headers["x-access-token"];
            if (token) {
                jwt.verify(token, process.env.secret, function(err, decoded){
                    if (err) return res.json( { success: false, message: "failed to verify token provided with request." } )
                    req.decoded = decoded;
                    console.log('req decoded >>>', req.decoded);
                    next();
                })
            } else {
                return res
                        .status(403)
                        .json({
                            success: false,
                            message: "no token provided with request."
                        })
            }
        }
     
    },
    verify_password_change: function(req, res){
        User
            .findOne( { _id: req.params.id } )
            .exec(function(err, user){
                if (err) return console.log(err)
                if (!user.validPassword(req.body.password)) return res.json( { success: false, message: "password invalid." } )
                res.json( { success: true, message: "password valid." } )
            })
    },
    change_password: function(req, res){
        User
            .findOne( { _id: req.params.id } )
            .exec(function(err, user){
                if (err) return console.log(err)
                user.password = user.generateHash(req.body.password);
                user.save(function(err, user){
                    if (err) return console.log(err)
                    res.json( { success: true, message: "password changed.", user: user } )
                })
            })
    },
    update: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function(err, user) {
                if (err) return console.log(err)
                if (req.body.username) {
                    user.username = req.body.username;
                }
                if (req.body.email) {
                    user.email = req.body.email;
                }
                if (req.body.password) {
                    user.password = req.body.password;
                }
                user.save( function(err, user) {
                    if (err) return console.log(err)
                    res.json( { success: true, message: "User Updated...", user: user } )
                } )
            } )
    },
    remove_user: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function( err , user ){
                if (err) return console.log(err)
                for (var i = 0; i < user.statuses.length; i++){
                    var s = user.statuses[i]                    
                    Status.findOneAndRemove( { _id: s }, function(err){
                        if (err) return console.log(err)
                        console.log("status removed.") 
                    } )
                }
                  User
                    .findOneAndRemove( { _id: req.params.id }, function(err) {
                        if (err) return console.log(err)
                        res.json( { success: true, message: "User Deleted..." } );
                    })
            })
      
    },
    /*

        when you follow someone, you gain one following and they gain one follower
        when someone follows you, you gain one follower and they gain one following

    */
    follow: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function(err, user) {
                if (err) return console.log(err)
                User
                    .findOne( { _id: req.body.user_to_follow } )
                    .exec( function(err, user_to_follow){
                        if (err) return console.log(err)
                        if (user.following.indexOf(user_to_follow._id) !== -1) return res.json({ success: false, message: "you are already following this user.", user: user, user_to_follow: user_to_follow })
                        user.following.push(user_to_follow._id);
                        user.save( function(err, user){
                            if (err) return console.log(err)
                            user_to_follow.followers.push(user._id)
                            user_to_follow.save( function(err, user_to_follow) {
                                if (err) return console.log(err)
                                res.json( { success: true, message: "user followed.", user: user, user_to_follow: user_to_follow } )
                            })
                        })
                    })
            })
    },
    unfollow: function(req, res) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function(err, user) {
                if (err) return console.log(err)
                User
                    .findOne( { _id: req.body.user_to_unfollow } )
                    .exec( function(err, user_to_unfollow) {
                        if (err) return console.log(err)
                        user.following.pull(user_to_unfollow._id);
                        user.save( function(err, user) {
                            if (err) return console.log(err)
                            user_to_unfollow.followers.pull(user._id);
                            user_to_unfollow.save( function(err, user_to_unfollow) {
                                if (err) return console.log(err)
                                res.json( { success: true, message: "user unfollowed.", user: user, user_to_unfollow: user_to_unfollow } );
                            })
                        })
                    })
            })
    }
    
}