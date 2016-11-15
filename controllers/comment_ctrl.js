var Comment = require("../models/comment.js");
var Status = require("../models/status.js");
var User = require("../models/user.js");

module.exports = {
    show: function(req, res) {
        Comment
            .findOne({ _id: req.params.id })
            .exec( function(err, comment) {
                if (err) return console.log(err)
                res.json( { success: true, message: "comment found.", comment: comment } )
            })
    },
    create: function(req, res) {
        Status
            .findOne( { _id: req.params.id } )
            .exec( function(err, status){
                if (err) return console.log(err)
                // with user_id and content
                var comment = new Comment(req.body);
                comment.status_id = status._id;
                comment.save( function(err, comment){
                    if (err) return console.log(err)
                    status.comments.push(comment);
                    status.save( function(err, status){
                        if (err) return console.log(err)
                        res.json( { success: true, message: "comment created for status.", status: status, comment: comment } )
                    })
                })

            })
    },
    remove_comment: function(req, res) {
        Comment
            .findOne( { _id: req.params.id } )
            .exec( function(err, comment){
                if (err) return console.log(err)
                Status
                    .findOne( {_id: comment.status_id } )
                    .exec(function(err, status){
                        if (err) return console.log(err)
                        status.comments.pull(comment._id);
                        status.save(function(err, status){
                            if (err) return console.log(err)
                            Comment
                                .findOneAndRemove({_id: req.params.id}, function(err){
                                    if (err) return console.log(err)
                                    res.json({success: true, message: "comment deleted.", status: status});
                                })
                        })
                    })
            })
    },
    like_comment: function(req, res) {
        Comment
            .findOne( { _id: req.params.id } )
            .exec( function(err, comment){
                if (err) return console.log(err)
                var arr_in_index = comment.likes.indexOf(req.body.user_id);
                if (arr_in_index !== -1) return res.json( { success: false, message: "comment already liked." } )
                User
                    .findOne( { _id: req.body.user_id } )
                    .exec( function(err, user){
                        if (err) return console.log(err)
                        comment.likes.push(user._id);
                        comment.save( function(err, comment){
                            if (err) return console.log(err)
                            res.json( { success: true, message: "comment liked", user: user, comment: comment } )
                        })
                    })
            })
    },
    dislike_comment: function(req, res) {
        Comment
            .findOne( { _id: req.params.id } )
            .exec( function(err, comment){
                if (err) return console.log(err)
                var index_in_arr = comment.likes.indexOf(req.body.user_id);
                User
                    .findOne( { _id: req.body.user_id } )
                    .exec( function(err, user){
                        if (err) return console.log(err)
                        comment.likes.splice(index_in_arr, 1);
                        comment.save( function(err, comment){
                            if (err) return console.log(err)
                            res.json( { success: true, message: "comment disliked", comment: comment, user: user } )
                        })
                    })
            })
    }
}