var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("./db");
const upload = multer();
var bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/login", upload.none(), function (req, res, next) {
  const id = req.body.inputID;
  const pw = req.body.inputPW;

  db.query(
    "select id, pw from idpwtable where id = ?",
    [id],
    (err, result, fields) => {
      if (err)
        res.json({
          success: false,
          message: "login failed. not matched id",
          errs: ["login error. try again."],
        });
      if (result[0] !== undefined && result[0].id === id) {
        bcrypt.compare(pw, result[0].pw, function (err, valid) {
          if (valid) {
            req.session.userID = id;
            req.session.isLogined = true;
            res.json({ success: true, message: "login success." });
          } else {
            res.json({
              success: false,
              message: "login failed. not matched ID or password.",
              errs: ["login failed. not matched ID or password."],
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: "error",
          errs: ["login failed. not matched ID or password."],
        });
      }
    }
  );
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
    errs.push("ID must be at least 4");
    errs.push("ID only contain alphabets and digits.");
  }
  if (!pwRegEx.test(pw)) {
    isErr = true;
    errs.push("Password must be at least 8");
    errs.push(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  }
  if (isErr) {
    res.json({
      success: false,
      message: "Signup failed.",
      errs: errs,
    });
  } else
    bcrypt.hash(pw, saltRounds, function (err, hashed) {
      db.query(
        "insert into idpwtable(id, pw) value(?, ?);",
        [id, hashed],
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
});

router.get("/logout", function (req, res, next) {
  if (req.session.isLogined === true) {
    req.session.destroy();
    res.send("OK!");
  } else {
    res.send("not logined.");
  }
});
router.get("/userid", function (req, res, next) {
  var session = req.session;
  if (session.userID === undefined)
    res.json({
      logined: false,
      userID: "",
    });
  else
    res.json({
      logined: true,
      userID: req.session.userID,
    });
});
module.exports = router;
