var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("./db");
const upload = multer();
var bcrypt = require("bcrypt");
const conn = require("./db");
const { getTimeAsString } = require("./mydate");
const saltRounds = 10;

router.post("/login", upload.none(), function (req, res, next) {
  const id = req.body.inputID;
  const pw = req.body.inputPW;

  db.query("select uid, id, pw from users where id = ?", [id], (err, result, fields) => {
    if (err)
      res.json({
        success: false,
        message: "Login failed.",
        errs: ["Login error. try again."],
      });
    if (result[0] !== undefined && result[0].id === id) {
      bcrypt.compare(pw, result[0].pw, function (err, valid) {
        if (valid) {
          req.session.userID = id;
          req.session.UID = result[0].uid;
          req.session.isLogined = true;
          res.json({ success: true, message: "login success." });
        } else {
          res.json({
            success: false,
            message: "Login failed.",
            errs: ["Login failed. not matched ID or password."],
          });
        }
      });
    } else {
      res.json({
        success: false,
        message: "Error",
        errs: ["Login failed. not matched ID or password."],
      });
    }
  });
});

router.post("/signup", upload.none(), function (req, res, next) {
  const id = req.body.inputID;
  const pw = req.body.inputPW;
  var isErr = false;
  const errs = [];
  const idRegEx = /^[a-zA-Z0-9]{4,}$/gm;
  const pwRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (!idRegEx.test(id)) {
    isErr = true;
    errs.push("ID must be at least 4.");
    errs.push("ID only contain alphabets and digits.");
  }
  if (!pwRegEx.test(pw)) {
    isErr = true;
    errs.push("Password must be at least 8");
    errs.push("Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.");
  }
  if (isErr) {
    res.json({
      success: false,
      message: "Signup failed.",
      errs: errs,
    });
  } else {
    const currdate = getTimeAsString();
    bcrypt.hash(pw, saltRounds, function (err, hashed) {
      db.query(
        "insert into users(id, pw, signupDate) value(?, ?, ?);",
        [id, hashed, currdate],
        (err, result, fields) => {
          if (err)
            res.json({
              success: false,
              message: "Signup failed. There's Same ID.",
              errs: ["Signup failed. There's Same ID."],
            });
          else {
            console.log(result);
            res.json({
              success: true,
              message: "Signup Success.",
            });
          }
        }
      );
    });
  }
});

router.get("/logout", function (req, res, next) {
  if (req.session.isLogined === true) {
    req.session.destroy();
    res.json({
      success: true,
      message: "Logout Success.",
    });
  } else {
    res.send({
      success: false,
      message: "Not Logined.",
    });
  }
});
router.get("/userid", function (req, res, next) {
  var session = req.session;
  req.session.touch();
  if (session.userID === undefined)
    res.json({
      logined: false,
      userID: "",
      UID: -1,
    });
  else
    res.json({
      logined: true,
      userID: req.session.userID,
      UID: req.session.UID,
    });
});

router.get("/userinfo", function (req, res, next) {
  var session = req.session;
  if (session.userID === undefined)
    res.json({
      success: false,
      message: "not logined.",
      errs: ["not logined."],
    });
  else {
    conn.query(
      `
      SELECT id, name, author, upvoteDate FROM upvotes
      LEFT JOIN (SELECT id, name, author FROM recipes 
		    LEFT JOIN (SELECT uid, id AS author FROM users) u_info
          ON recipes.authorid = u_info.uid) recNames
		    ON recNames.id = upvotes.recipeid
      WHERE userID = ?
      ORDER BY upvoteDate DESC;`,
      [session.UID],
      function (err, result, fields) {
        if (err) res.json({ errs: err });
        else {
          res.json({
            success: true,
            userInfo: {
              userID: req.session.userID,
              upvoteLog: result,
            },
          });
        }
      }
    );
  }
});

module.exports = router;
