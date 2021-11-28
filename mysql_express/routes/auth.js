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
    "select pw from idpwtable where id = ?",
    [id],
    (err, result, fields) => {
      if (result.length === 0) res.status(404).send("NOT FOUND");
      else
        bcrypt
          .compare(pw, result[0].pw)
          .then(
            (val) => {
              if (val) res.send("OK");
              else res.status(400).send("NOT MATCHED");
            },
            (rej) => {
              res.status(400).send("NOT MATCHED");
            }
          )
          .catch((reason) => {
            console.log(reason);
          });
    }
  );
});

router.post("/signup", upload.none(), function (req, res, next) {
  const id = req.body.inputID;
  const pw = req.body.inputPW;
  bcrypt.hash(pw, saltRounds, function (err, hashed) {
    db.query(
      "insert into idpwtable(id, pw) value(?, ?);",
      [id, hashed],
      (err, result, fields) => {
        if (err) res.send("NO");
        else {
          console.log(result);
          res.send("OK");
        }
      }
    );
  });
});

module.exports = router;
