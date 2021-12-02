module.exports = function (
  app,
  passport,
  db,
  fs,
  multer,
  multerS3,
  cloudinary,
  computerVisionClient,
  ApiKeyCredentials,
  ObjectId
) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  // app.get("/", function (req, res) {
  //   res.render("index.ejs");
  // });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    // let capturedImage = photos.filter(e);
    // console.log(capturedImage);
    console.log("from profile");
    db.collection("photos")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });

  // =========result ejs route=========

  app.post("/result", async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.body.imageURL);
      const objectURL = result.secure_url;

      // Analyze a URL image
      console.log("Analyzing objects in image...", objectURL.split("/").pop());
      const objects = (
        await computerVisionClient.analyzeImage(objectURL, {
          visualFeatures: ["Objects"],
        })
      ).objects;
      let nameOfObject;
      // Print objects bounding box and confidence
      if (objects.length) {
        console.log(
          `${objects.length} object${objects.length == 1 ? "" : "s"} found:`
        );

        for (const obj of objects) {
          nameOfObject = obj.object;
        }
      } else {
        nameOfObject = "Please try again!";
      }

      function formatRectObjects(rect) {
        return (
          `top=${rect.y}`.padEnd(10) +
          `left=${rect.x}`.padEnd(10) +
          `bottom=${rect.y + rect.h}`.padEnd(12) +
          `right=${rect.x + rect.w}`.padEnd(10) +
          `(${rect.w}x${rect.h})`
        );
      }
      console.log(nameOfObject);
      let objectName = nameOfObject;
      let itemURL = objectURL;
      console.log("from result 129", objectName, itemURL);

      console.log("from result");
      res.redirect(
        `result/${encodeURIComponent(objectName)}splitHere${encodeURIComponent(
          itemURL
        )}`
      );
      // res.render("result.ejs",{nameOfObject:nameOfObject, img: objectURL});
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/result/:result", function (req, res) {
    let arr = req.params.result.split("splitHere");
    let nameOfObject = arr[0];
    let img = arr[1];
    res.render("result.ejs", { nameOfObject: nameOfObject, img: img });
  });

  app.put("/result/savedArticle", function (req, res) {
    // console.log(req.body.ancorButton,req.body.imgSource)
    db.collection("reverseimage").findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          savedArticles: {
            ancorButton: req.body.ancorButton,
            imgSource: req.body.imgSource,
          },
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
  app.get("/library", function (req, res) {
    db.collection("reverseimage")
      .find({ _id: req.user._id })
      .toArray((err, result) => {
        console.log("this is from routes", result[0].savedArticles);
        if (err) return console.log(err);
        res.render("library.ejs", {
          articles: result[0].savedArticles,
          dog: result[0]._id,
        });
      });
  });
  app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  // ===================>
  app.delete("/deleteContent", (req, res) => {
    db.collection("reverseimage").findOneAndDelete(
      {
        _id: ObjectId(req.body.trash),
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/");
  }
};
