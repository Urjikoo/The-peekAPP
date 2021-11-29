// server.js

// set up ======================================================================
// get all the tools we need
var aws = require("aws-sdk");
var express = require("express");
var app = express();
var port = process.env.PORT || 9000;
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var configAWS = require("./config/aws.js");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var fs = require("fs");
var configDB = require("./config/database.js");
var multerS3 = require("multer-s3");
var s3 = new aws.S3(configAWS);

var db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passport, db, fs, s3, multer, multerS3, aws,cloudinary, computerVisionClient, ApiKeyCredentials );
}); // connect to our database

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rcbootcamp2021b", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================
console.log("The magic happens on port " + port);
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

//MS Specific
const axios = require("axios").default;
const async = require("async");
const https = require("https");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const computerVision =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

require("dotenv").config({ path: "./config/.env" });

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const key = process.env.MS_COMPUTER_VISION_SUBSCRIPTION_KEY;
const endpoint = process.env.MS_COMPUTER_VISION_ENDPOINT;
const faceEndpoint = process.env.MS_FACE_ENDPOINT;
const subscriptionKey = process.env.MS_FACE_SUB_KEY;

const computerVisionClient = new computerVision(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

//Server Setup
app.set("view engine", "ejs");
app.use(express.static("public"));

//Routes
// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });
// // get request for result.ejs
// app.get("/result", (req, res) => {
//
//
//   // function submit(){
//   // `https://www.googleapis.com/customsearch/v1?key=AIzaSyDNPtBdXEkN_R85DDzctdkmOK1OQJ99dZA&cx=8cb38a72715546101&q=${objectName}&callback=hndlr`;
//   //
//   // }
//   // submit()
//   // // ===========function for the API====================>
//   // function hndlr(res){
//   // try{
//   //   for(let i=0; i<res.items.length; i++){
//   //    console.log(res.items)
//   //   }
//   // }catch(err){
//   //   console.log(err)
//   // }
//   // }
// res.render("result.ejs",{nameOfObject:objectName, img: itemURL});
//
// });

// let itemURL;
// let objectName;
// ===================function2 for API=======>




// POST req
// app.post("/result", async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.body.imageURL);
//     const objectURL = result.secure_url;
//
//     // Analyze a URL image
//     console.log("Analyzing objects in image...", objectURL.split("/").pop());
//     const objects = (
//       await computerVisionClient.analyzeImage(objectURL, {
//         visualFeatures: ["Objects"],
//       })
//     ).objects;
//     let nameOfObject;
//     // Print objects bounding box and confidence
//     if (objects.length) {
//       console.log(
//         `${objects.length} object${objects.length == 1 ? "" : "s"} found:`
//       );
//
//
//
//       for (const obj of objects) {
//         nameOfObject= obj.object
//       }
//    }
//
//     function formatRectObjects(rect) {
//       return (
//         `top=${rect.y}`.padEnd(10) +
//         `left=${rect.x}`.padEnd(10) +
//         `bottom=${rect.y + rect.h}`.padEnd(12) +
//         `right=${rect.x + rect.w}`.padEnd(10) +
//         `(${rect.w}x${rect.h})`
//       );
//     }
//    console.log(nameOfObject)
//    objectName = nameOfObject;
//    itemURL = objectURL;
//    console.log('from result')
//    res.redirect("/result");
//     // res.render("result.ejs",{nameOfObject:nameOfObject, img: objectURL});
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(port);
