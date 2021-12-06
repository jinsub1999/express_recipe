var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var conn = require("./db");
const { getTimeAsString } = require("./mydate");
router.get("/", function (req, res, next) {
  res.render("index", { title: "MySQL" });
});
router.get("/recipe", function (req, res, next) {
  if (req.session.isLogined) {
    const usrId = req.session.userID;
    conn.query(
      `
      SELECT id, name, author, recipe, uploadDate, modifyDate, IF(userID IS NOT NULL, 1, 0) AS upvoted, IFNULL(upvs, 0) upvs
      FROM recipes LEFT JOIN (SELECT * FROM upvotes WHERE userid=?) ups
      ON recipes.id = ups.recipeid LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid)
      uups on recipes.id = uups.recipeid;`,
      [usrId],
      function (err, rows, fields) {
        if (err) throw err;
        if (rows !== undefined) {
          res.header({ "content-type": "application/json" });
          res.send(rows);
        } else res.json({ success: true });
      }
    );
  } else {
    conn.query(
      `
    SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) AS upvs
    FROM recipes LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) ups 
    ON recipes.id = ups.recipeid;
    `,
      function (err, rows, fields) {
        if (err) throw err;
        if (rows !== undefined) {
          res.header({ "content-type": "application/json" });
          res.send(rows);
        } else res.json({ success: true });
      }
    );
  }
});
router.post("/recipe", upload.none(), function (req, res, next) {
  if (req.session.isLogined) {
    const currdate = getTimeAsString();
    conn.query(
      `INSERT INTO recipes(name, recipe, author, uploadDate) 
      VALUE(?,?,?,?);`,
      [req.body.recipeName, req.body.recipeBody, req.session.userID, currdate],
      function (err, result, fields) {
        if (err) {
          res.status(200).json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
        } else {
          res.header({ "content-type": "application/json" });
          res.json({
            success: true,
            message: "Upload success.",
          });
        }
      }
    );
  } else
    res.json({
      success: false,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
});
router.post("/upvote/:recipeID", upload.none(), function (req, res, next) {
  const recId = req.params.recipeID;
  if (req.session.isLogined) {
    const usrId = req.session.userID;
    const currdate = getTimeAsString();

    conn.query(
      `INSERT INTO upvotes(userID, recipeID, upvoteDate) VALUE(?, ?, ?)`,
      [usrId, recId, currdate],
      function (err, result, fields) {
        if (err) {
          res.status(200).json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
        } else {
          res.json({
            success: true,
            message: "Upvote success.",
          });
        }
      }
    );
  } else res.json({ success: false, message: "login required.", errs: ["login required"] });
});
router.delete("/upvote/:recipeID", upload.none(), function (req, res, next) {
  const recId = req.params.recipeID;
  const usrId = req.session.userID;
  conn.query(`DELETE FROM upvotes where userid = ? and recipeid = ?`, [usrId, recId], function (err, result, fields) {
    if (err) {
      res.status(200).json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
    } else {
      res.json({
        success: true,
        message: "Removing upvote success.",
      });
    }
  });
});
router.delete("/recipe/:authorID/:recipeID/", upload.none(), function (req, res, next) {
  const recId = req.params.recipeID;
  const authorId = req.params.authorID;
  const usrId = req.session.userID;
  console.log(recId, authorId);
  if (usrId !== authorId) {
    res.json({ success: false, message: "Delete others", errs: ["레시피는 작성자만 지울 수 있습니다."] });
  } else
    conn.query(`DELETE FROM recipes where id = ? and author = ?`, [recId, usrId], function (err, result, fields) {
      if (err) {
        res.json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
      } else {
        console.log(result);
        res.json({
          success: true,
          message: "Removing upvote success.",
        });
      }
    });
});
module.exports = router;

router.get("/recipe/:recipeID", function (req, res, next) {
  const recId = req.params.recipeID;
  if (req.session.isLogined) {
    const usrId = req.session.userID;
    conn.query(
      `
      SELECT id, name, author, recipe, uploadDate, modifyDate, IF(userID IS NOT NULL, 1, 0) AS upvoted, IFNULL(upvs, 0) upvs
      FROM recipes LEFT JOIN (SELECT * FROM upvotes WHERE userid=?) ups
      ON recipes.id = ups.recipeid LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid)
      uups on recipes.id = uups.recipeid where id = ?;`,
      [usrId, recId],
      function (err, rows, fields) {
        if (err) res.json({ err: err });
        if (rows !== undefined) {
          res.json({ success: true, sameAuthor: rows[0].author === usrId, result: rows[0] });
        } else res.json({ success: false });
      }
    );
  } else {
    conn.query(
      `
    SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) AS upvs
    FROM recipes LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) ups 
    ON recipes.id = ups.recipeid where id = ?;
    `,
      [recId],
      function (err, rows, fields) {
        if (err) res.json({ err: err });
        if (rows !== undefined) {
          res.header({ "content-type": "application/json" });
          res.json({ success: true, sameAuthor: false, result: rows[0] });
        } else res.json({ success: false });
      }
    );
  }
});

router.put("/recipe/:recipeID", upload.none(), function (req, res, next) {
  if (req.session.isLogined) {
    const currdate = getTimeAsString();
    conn.query(
      `update recipes set name = ?, recipe = ?, modifyDate = ? where id = ?;`,
      [req.body.recipeName, req.body.recipeBody, currdate, req.body.recipeID],
      function (err, result, fields) {
        if (err) {
          res.status(200).json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
        } else {
          res.header({ "content-type": "application/json" });
          res.json({
            success: true,
            message: "Modify success.",
          });
        }
      }
    );
  } else
    res.json({
      success: false,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
});
