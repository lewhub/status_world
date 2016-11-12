var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");
var body_parser = require("body-parser");
var path = require("path");
var morgan = require("morgan");
var user_rts = require("./routes/user_rts.js");
var status_rts = require("./routes/status_rts.js");
var dotenv = require("dotenv").load({ silent: true });

// for local mongo shell db testing
// mongoose.connect("mongodb://localhost/blog_universe", function(err){
//     if (err) return console.log(err)
//     console.log("connected to blog_universe db...")
// })
mongoose.connect(process.env.MLAB_URI, function(err){
    if (err) return console.log(err)
    console.log("connect to status_universe");
})

app.use(body_parser.urlencoded( { extended: false } ));
app.use(body_parser.json());
app.use("/public", express.static(path.join( __dirname, "public" )));
app.use( morgan("dev") );
app.use("/users", user_rts);
app.use("/statuses", status_rts);

app.get( "/", function(req, res) {
    res.sendFile( path.join(__dirname, "public", "index.html") );
})

app.listen(port, function(err){
    if (err) return console.log(err)
    console.log("connected at port", port + "...")
})
