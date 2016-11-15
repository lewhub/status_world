var Comment = require("../models/comment.js");
var Status = require("../models/status.js");

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
    }
}