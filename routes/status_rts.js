var express = require("express");
var status_router = express.Router();
var status_ctrl = require("../controllers/status_ctrl.js");

status_router.route("/")
    .get(status_ctrl.index)
status_router.post("/like-status/:id", status_ctrl.like_status);
status_router.post("/dislike-status/:id", status_ctrl.dislike_status);
status_router.route("/:id")
    .get(status_ctrl.show)
    .post(status_ctrl.create)
    .patch(status_ctrl.update)
    .delete(status_ctrl.remove_status)


module.exports = status_router;