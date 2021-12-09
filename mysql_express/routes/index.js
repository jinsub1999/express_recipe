var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
const upload = multer();
var conn = require("./db");
var asyncMysql = require("mysql2/promise");
const { getTimeAsString } = require("./mydate");
const conn2 = require("./asyncdb");
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});
router.get("/recipe", function (req, res, next) {
  if (req.session.isLogined) {
    const UID = req.session.UID;
    conn.query(
      `
      SELECT id, name, author, recipe, uploadDate, modifyDate, 
        IF(userID IS NOT NULL, 1, 0) AS upvoted, IFNULL(upvs, 0) upvs
      FROM recipes 
      LEFT JOIN (SELECT * FROM upvotes WHERE userid=?) ups ON recipes.id = ups.recipeid
      LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes GROUP BY recipeid) 
        uups ON recipes.id = uups.recipeid
      LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid;`,
      [UID],
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
      SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) upvs
      FROM recipes 
      LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes GROUP BY recipeid) 
        uups ON recipes.id = uups.recipeid
      LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid;`,
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
router.post("/recipe", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    conn.beginTransaction();
    const currdate = getTimeAsString();
    conn2.getConnection;
    conn.query(`SELECT uid FROM users WHERE id = ?`, [req.session.userID], function (err, result1, fields) {
      if (err) {
        conn.rollback();
        throw err;
      } else {
        if (result1[0] === undefined) {
          conn.rollback();
          res.json({ success: false, message: "존재하지 않는 사용자입니다." });
        }
        const currUID = result1[0].uid;
        conn.query(
          `INSERT INTO recipes(name, recipe, authorID, uploadDate) 
          VALUE(?,?,?,?);`,
          [req.body.recipeName, req.body.recipeBody, currUID, currdate],
          function (err, result2, fields) {
            if (err) {
              conn.rollback();
              res.json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
            } else {
              const ingredArr = JSON.parse(req.body.recipeIngred);
              var ingredSuccess = true;
              var recipePK = null;
              conn.query(`SELECT LAST_INSERT_ID() AS rpk`, function (err, resultPK1, fields) {
                if (err) ingredSuccess = false;
                else {
                  recipePK = resultPK1[0].rpk;
                  ingredArr.forEach((val, idx) => {
                    if (!ingredSuccess) return;
                    const ingName = val.ingredName;
                    conn.query(
                      `
                      SELECT id FROM ingredients WHERE kind = ?;
                      `,
                      [ingName],
                      async function (err, result3, fields) {
                        if (err) {
                          ingredSuccess = false;
                        } else if (result3[0] === undefined) {
                          if (recipePK !== null) {
                            try {
                              const mysqlConn = await myPool.getConnection(async (c) => c);
                              const result4 = await mysqlConn.query(`INSERT INTO ingredients(kind) VALUE(?);`, [
                                ingName,
                              ]);
                              const result5 = await mysqlConn.query(
                                `
                              INSERT INTO ingred_recipe(recipe_id, ingred_id)
                              VALUE(?, (SELECT LAST_INSERT_ID()));`,
                                [recipePK]
                              );
                            } catch (e) {
                              console.log(e);
                              ingredSuccess = false;
                            }
                            // conn.query(
                            //   `
                            //   INSERT INTO ingredients(kind) VALUE(?);
                            //   `,
                            //   [ingName],
                            //   function (err, result4, fields) {
                            //     console.log("INSERT!!!", err);
                            //     if (err) ingredSuccess = false;
                            //     else
                            //       conn.query(
                            //         `
                            //         INSERT INTO ingred_recipe(recipe_id, ingred_id)
                            //         VALUE(?, (SELECT LAST_INSERT_ID()));
                            //         `,
                            //         [recipePK],
                            //         function (err, result5, fields) {
                            //           console.log("AFTER INSERT!!!", err);
                            //           if (err) {
                            //             ingredSuccess = false;
                            //           }
                            //         }
                            //       );
                            //   }
                            // );
                          } else ingredSuccess = false;
                        } else {
                          const iid = result3[0].id;
                          conn.query(
                            `
                            INSERT INTO ingred_recipe(recipe_id, ingred_id)
                            VALUE((SELECT LAST_INSERT_ID()), ?);
                            `,
                            [iid],
                            function (err, result6, fields) {
                              if (err) {
                                ingredSuccess = false;
                              }
                            }
                          );
                        }
                      }
                    );
                  });
                  if (ingredSuccess) {
                    conn.commit();
                    res.json({
                      success: true,
                      message: "Upload success.",
                    });
                  } else {
                    conn.rollback();
                    res.json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
                  }
                }
              });
            }
          }
        );
      }
    });
  } else {
    conn.rollback();
    res.json({
      success: false,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
  }
});
router.post("/upvote/:recipeID", upload.none(), function (req, res, next) {
  const recId = req.params.recipeID;
  if (req.session.isLogined) {
    const UID = req.session.UID;
    const currdate = getTimeAsString();
    conn.query(
      `INSERT INTO upvotes(userID, recipeID, upvoteDate) VALUE(?, ?, ?)`,
      [UID, recId, currdate],
      function (err, result, fields) {
        if (err) {
          res.status(200).json({ success: false, message: err, errs: ["에러가 발생하였습니다."] });
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
  if (req.session.isLogined) {
    const UID = req.session.UID;
    conn.query(`DELETE FROM upvotes where userid = ? and recipeid = ?`, [UID, recId], function (err, result, fields) {
      if (err) {
        res.status(200).json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
      } else {
        res.json({
          success: true,
          message: "Removing upvote success.",
        });
      }
    });
  } else res.json({ success: false, message: "login required.", errs: ["login required"] });
});
router.delete("/recipe/:recipeID", upload.none(), function (req, res, next) {
  const recId = req.params.recipeID;
  const UID = req.session.UID;
  conn.beginTransaction();
  conn.query(`SELECT authorID FROM recipes WHERE id = ?;`, [recId], function (err, result1, fields) {
    if (err) {
      conn.rollback();
      res.json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
    } else {
      console.log(result1);
      if (result1[0].authorID !== UID) {
        conn.rollback();
        res.json({ success: false, message: "error", errs: ["작성자만 삭제가능합니다."] });
      } else
        conn.query(`DELETE FROM recipes WHERE id = ? AND authorID = ?`, [recId, UID], function (err, result2, fields) {
          if (err) {
            conn.rollback();
            res.json({ success: false, message: "error", errs: ["에러가 발생하였습니다."] });
          } else {
            conn.commit();
            res.json({
              success: true,
              message: "Removing upvote success.",
            });
          }
        });
    }
  });
});
module.exports = router;

router.get("/recipe/:recipeID", function (req, res, next) {
  const recId = req.params.recipeID;
  if (req.session.isLogined) {
    const usrId = req.session.UID;
    console.log(usrId, recId);
    conn.query(
      `
      SELECT id, name, author, authorID, recipe, uploadDate, modifyDate, IF(userID IS NOT NULL, 1, 0) AS upvoted,
       IFNULL(upvs, 0) upvs
      FROM recipes
      LEFT JOIN (SELECT userID, recipeID FROM upvotes WHERE userid=?) ups ON recipes.id = ups.recipeid
      LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) uups
        ON recipes.id = uups.recipeid
      LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid
      where id = ?;`,
      [usrId, recId],
      function (err, rows, fields) {
        if (err) res.json({ err: err });
        if (rows !== undefined) {
          res.json({ success: true, sameAuthor: rows[0].authorID === usrId, result: rows[0] });
        } else res.json({ success: false });
      }
    );
  } else {
    conn.query(
      `
    SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) AS upvs
    FROM recipes LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) ups 
      ON recipes.id = ups.recipeid
    LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid
    where id = ?;
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
          res.json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
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

router.post("/test_trans", upload.none(), function (req, res, next) {
  conn.beginTransaction();
  conn.query(`SELECT * FROM recipes;`, function (err, result, fields) {
    if (err) {
      conn.rollback();
      res.json({ err: err });
    } else {
    }
  });
  conn.query(`SELECT * FROM recipes;`, function (err, result, fields) {
    if (err) {
      conn.rollback();
      res.json({ err: err });
    } else {
      conn.commit();
      res.json({ result: result });
    }
  });
});
