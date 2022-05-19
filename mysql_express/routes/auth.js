var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("./db");
const upload = multer();
var bcrypt = require("bcrypt");
const conn = require("./db");
const { getTimeAsString } = require("./mydate");
const conn2 = require("./asyncdb");
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

router.post("/signup", upload.none(), async function (req, res, next) {
  const id = req.body.inputID;
  const pw = req.body.inputPW;
  var isErr = false;
  const errs = [];
  const idRegEx = /^[a-zA-Z0-9]{4,}$/gm;
  const pwRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (!idRegEx.test(id)) {
    isErr = true;
    errs.push("아이디는 4글자 이상이여야 합니다.");
    errs.push("아이디는 알파벳과 숫자로만 이루어져야 합니다.");
  }
  if (!pwRegEx.test(pw)) {
    isErr = true;
    errs.push("암호는 8글자 이상이여야 합니다.");
    errs.push("암호는 각각 1개 이상의 대문자, 소문자 알파벳, 숫자가 포함되어야 합니다.");
  }
  if (isErr) {
    res.json({
      success: false,
      message: "Signup failed.",
      errs: errs,
    });
  } else {
    const currdate = getTimeAsString();
    const connection = await conn2.getConnection(async (c) => c);
    try {
      const sameID = await connection.query(
        `
      SELECT uid FROM users WHERE id = ? 
      `,
        [id]
      );
      if (sameID[0][0] !== undefined) throw "SAME ID EXISTS";
      bcrypt.hash(pw, saltRounds, async function (err, hashed) {
        const result = await connection.query(
          `
        INSERT INTO users(id, pw, signupDate) VALUE(?, ?, ?);`,
          [id, hashed, currdate]
        );
        await connection.commit();
        res.json({
          success: true,
          message: "Signup Success.",
        });
      });
    } catch (error) {
      await connection.rollback();
      console.log(error);
      if (error === "SAME ID EXISTS")
        res.json({
          success: false,
          errs: ["Signup failed. There's Same ID."],
        });
      else
        res.json({
          success: false,
          errs: [error],
        });
    }
    connection.release();
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
      err: "NOT LOGINED",
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

router.get("/userinfo", async function (req, res, next) {
  const connection = await conn2.getConnection(async (c) => c);
  connection.beginTransaction();
  var session = req.session;
  if (session.userID === undefined)
    res.json({
      success: false,
      message: "not logined.",
      errs: ["not logined."],
    });
  else {
    try {
      const upvLog = await connection.query(
        `
      SELECT id, name, author, upvoteDate FROM upvotes
      LEFT JOIN (SELECT id, name, author FROM recipes 
		    LEFT JOIN (SELECT uid, id AS author FROM users) u_info
          ON recipes.authorid = u_info.uid) recNames
		    ON recNames.id = upvotes.recipeid
      WHERE userID = ?
      ORDER BY upvoteDate DESC;`,
        [session.UID]
      );
      const bLog = await connection.query(
        `
      SELECT order_id, food_id, orderDate, prodName, sellerID, orderAmount FROM orders
      LEFT JOIN (SELECT id, name as prodName FROM products) prod ON prod.id = food_id
      LEFT JOIN (SELECT uid, id as sellerID FROM users) U ON U.uid = seller_id
      WHERE buyer_id = ?;`,
        [session.UID]
      );
      const upvoteLog = upvLog[0];
      const buyLog = bLog[0];
      await connection.commit();
      res.json({
        success: true,
        userInfo: {
          userID: req.session.userID,
          upvoteLog: upvoteLog,
          buyLog: buyLog,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.log(error);
      res.json({
        success: false,
        err: error,
      });
    }
  }
  connection.release();
});

module.exports = router;
