var Status = require("../models/status.js");
var User = require("../models/user.js");

// todo -- make update and delete for statuses and then routes file for statuses and then test backend via mongo shell and postman

module.exports = {
    index: function( req, res ) {
        Status
            .find( { } )
            .exec( function(err, statuses) {
                if (err) return console.log(err)
                res.json( { success: true, message: "All statuses found...", statuses: statuses } );
            } )
    },
    show: function( req, res ) {
        Status
            .findOne( { _id: req.params.id } )
            .exec( function(err, status) {
                if (err) return console.log(err)
                res.json( { success: true, message: "Status Found...", status: status } )
            })
    },
    create: function( req, res ) {
        User
            .findOne( { _id: req.params.id } )
            .exec( function(err, user) {
                if (err) return console.log(err)
                var status = new Status(req.body);
                status.user_id = user._id
                status.save( function(err, status) {
                    if (err) return console.log(err)
                    user.statuses.push(status);
                    user.save(function(err, user) {
                        if (err) return console.log(err)
                        res.json( { success: true, message: "Status created for user...", status: status, user: user } );
                    } )
                } )
            } )
    },
    update: function ( req, res ) {
        Status
            .findOne( { _id: req.params.id } )
            .exec( function( err, status ) {
                if (err) return console.log(err)
                if ( req.body.content ) {
                    status.content = req.body.content;
                }
                status.save( function( err, status ) {
                    if (err) return console.log(err)
                    res.json( { success: true, message: "Status Updataed...", status: status } )
                })
            })
    },
    remove_status: function( req, res ) {
        Status
            .findOne( { _id: req.params.id } )
            .exec( function( err, status ) {
                if (err) return console.log(err)
                User
                    .findOne({_id: status.user_id})
                    .exec( function(err, user){
                        if (err) return console.log(err)
                        console.log("removing status...")
                        // console.log(user.statuses)
                        user.statuses.pull(status._id)
                        user.save( function(err, user){
                            if (err) return console.log(err)
                            Status.findOneAndRemove({_id: req.params.id}, function(err){
                                if (err) return console.log(err)
                                res.json({ success: true, message: "status removed from user\'s array", user: user })
                            })
                        })
                    })
            })
     },
     like_status: function(req, res) {
         Status
            .findOne( {_id: req.params.id} )
            .exec( function(err, status) {
                if (err) return console.log(err)
                var index_in_arr = status.likes.indexOf(req.body.user_id)
                if (index_in_arr !== -1) return res.json({ success: false, message: "status already liked" })
                User
                    .findOne({_id: req.body.user_id})
                    .exec( function(err, user) {
                        if (err) return console.log(err)
                        status.likes.push(user._id);
                        status.save( function(err, status) {
                            if (err) return console.log(err)
                            res.json({success: true, message: "status liked!", status: status})
                        })
                        
                    })
            })
     },
     dislike_status: function(req, res) {
         Status
            .findOne( {_id: req.params.id} )
            .exec( function(err, status) {
                if (err) return console.log(err)
                var index_in_arr = status.likes.indexOf(req.body.user_id);
                User
                    .findOne( { _id: req.body.user_id } )
                    .exec( function(err, user) {
                        if (err) return console.log(err)
                        status.likes.splice(user._id, 1);
                        status.save( function(err, status) {
                            if (err) return console.log(err)
                            res.json( { success: true, message: "status disliked", status } )
                        })
                    })
            } )
     }
     
}