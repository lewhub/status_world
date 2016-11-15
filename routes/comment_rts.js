var express = require("express");
var comment_router = express.Router();
var comment_ctrl = require("../controllers/comment_ctrl.js");

comment_router.post("/:id", comment_ctrl.create);
comment_router.get("/:id", comment_ctrl.show);
comment_router.delete("/:id", comment_ctrl.remove_comment);


module.exports = comment_router;
