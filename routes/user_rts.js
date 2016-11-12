var express = require("express");
var user_router = express.Router();
var user_ctrl = require("../controllers/user_ctrl.js");

user_router.post("/login", user_ctrl.login);
user_router.use("/password-change/:id", user_ctrl.verify_access);
user_router.use("/password-change-confirmed/:id", user_ctrl.verify_access);
// patch new password on front end.
user_router.use("/:id", user_ctrl.verify_access);

user_router.route("/")
    .get( user_ctrl.index )
    .post( user_ctrl.create )

user_router.patch("/password-change/:id", user_ctrl.verify_password_change);
user_router.patch("/password-change-confirmed/:id", user_ctrl.change_password);
user_router.route("/:id")
    .get( user_ctrl.show )
    .patch( user_ctrl.update )
    .delete( user_ctrl.remove_user )


module.exports = user_router;