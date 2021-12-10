var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
const upload = multer();
var conn = require("./db");
const { getTimeAsString } = require("./mydate");
const conn2 = require("./asyncdb");
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});
router.get("/recipe", async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    var _result = null;
    await connection.beginTransaction();
    const UID = req.session.UID;
    try {
      const rows = await connection.query(
        `
      SELECT id, name, author, recipe, uploadDate, modifyDate, 
          IF(userID IS NOT NULL, 1, 0) AS upvoted, IFNULL(upvs, 0) upvs
        FROM recipes 
        LEFT JOIN (SELECT * FROM upvotes WHERE userid=?) ups ON recipes.id = ups.recipeid
        LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes GROUP BY recipeid) 
          uups ON recipes.id = uups.recipeid
        LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid;
      `,
        [UID]
      );
      _result = rows;
    } catch (e) {
      await connection.rollback();
      res.json({ success: false, err: e });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({ success: true, result: _result });
    }
  } else {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    var _result = null;
    await connection.beginTransaction();
    try {
      const rows = await connection.query(
        `
        SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) upvs
        FROM recipes 
        LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes GROUP BY recipeid) 
          uups ON recipes.id = uups.recipeid
        LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid;
      `
      );
      _result = rows;
    } catch (e) {
      await connection.rollback();
      res.json({ success: false, err: e });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({ success: true, result: _result });
    }
    connection.release();
  }
});
router.post("/recipe", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    const currdate = getTimeAsString();
    var rpk = null;
    var iferr = false;
    await connection.beginTransaction();
    try {
      const result2 = await connection.query(
        `
        INSERT INTO recipes(name, recipe, authorID, uploadDate) 
        VALUE(?,?,?,?);`,
        [req.body.recipeName, req.body.recipeBody, req.session.UID, currdate]
      );
      const ingredArr = JSON.parse(req.body.recipeIngred);
      var recipePK = null;
      const resultPK1 = await connection.query(`SELECT LAST_INSERT_ID() AS rpk`);
      recipePK = resultPK1[0][0].rpk;
      rpk = recipePK;
      for await (elem of ingredArr) {
        const ingName = elem.ingredName;
        const result3 = await connection.query(`SELECT id FROM ingredients WHERE kind = ?`, [ingName]);
        if (result3[0][0] === undefined) {
          const result4 = await connection.query(`INSERT INTO ingredients(kind) VALUE(?);`, [ingName]);
          const result5 = await connection.query(
            `
          INSERT INTO ingred_recipe(recipe_id, ingred_id)
          VALUE(?, (SELECT LAST_INSERT_ID()));`,
            [recipePK]
          );
        } else {
          const iid = result3[0][0].id;

          const result6 = await connection.query(
            `INSERT INTO ingred_recipe(recipe_id, ingred_id)
              VALUE((SELECT LAST_INSERT_ID()), ?);`,
            [iid]
          );
        }
      }
    } catch (err) {
      console.log(err);
      await connection.rollback();
      res.json({
        success: false,
        message: "not logined.",
        errs: ["에러 발생"],
      });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({
        success: true,
        message: "확인 메시지",
        recipeKey: rpk,
      });
    }
    connection.release();
  } else {
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
          res.json({ success: false, message: err, errs: ["에러가 발생하였습니다."] });
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

router.get("/recipe/:recipeID", async function (req, res, next) {
  const recId = req.params.recipeID;
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    const usrId = req.session.UID;
    var iferr = false;
    var _result = null;
    var _ingred = null;
    await connection.beginTransaction();
    try {
      const rows = await connection.query(
        `
        SELECT id, name, author, authorID, recipe, uploadDate, modifyDate, IF(userID IS NOT NULL, 1, 0) AS upvoted,
          IFNULL(upvs, 0) upvs
        FROM recipes
        LEFT JOIN (SELECT userID, recipeID FROM upvotes WHERE userid=?) ups ON recipes.id = ups.recipeid
        LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) uups
          ON recipes.id = uups.recipeid
        LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid
        WHERE id = ?;
        `,
        [usrId, recId]
      );
      _result = rows[0][0];
      if (rows[0][0] === undefined) throw "NOT FOUND";
      const ingRes = await connection.query(
        `
      SELECT ingred_id, kind FROM recipes
      LEFT JOIN (ingred_recipe  LEFT JOIN ingredients ON ingredients.id = ingred_recipe.ingred_id)
        ON recipes.id = ingred_recipe.recipe_id
      WHERE recipes.id = ?;
      `,
        [recId]
      );
      if (ingRes[0][0].ingred_id !== null) {
        _ingred = ingRes[0];
      } else {
        _ingred = [];
      }
    } catch (e) {
      iferr = true;
      res.json({ success: false, err: e });
    }
    if (!iferr) {
      res.json({ success: true, sameAuthor: _result.authorID === usrId, result: _result, ingred: _ingred });
    }
    connection.release();
  } else {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    var _result = null;
    var _ingred = null;
    await connection.beginTransaction();
    try {
      const rows = await connection.query(
        `
        SELECT id, name, author, recipe, uploadDate, modifyDate, IFNULL(upvs, 0) AS upvs
        FROM recipes LEFT JOIN (SELECT recipeid, count(recipeid) as upvs FROM upvotes group by recipeid) ups 
          ON recipes.id = ups.recipeid
        LEFT JOIN (SELECT uid, id as author from users) u_info ON recipes.authorID = u_info.uid
        where id = ?;
        `,
        [recId]
      );
      _result = rows[0][0];
      if (rows[0][0] === undefined) throw "NOT FOUND";
      const ingRes = await connection.query(
        `
      SELECT ingred_id, kind FROM recipes
      LEFT JOIN (ingred_recipe  LEFT JOIN ingredients ON ingredients.id = ingred_recipe.ingred_id)
        ON recipes.id = ingred_recipe.recipe_id
      WHERE recipes.id = ?;
      `,
        [recId]
      );
      if (ingRes[0][0].ingred_id !== null) {
        _ingred = ingRes[0];
      } else {
        _ingred = [];
      }
    } catch (e) {
      iferr = true;
      res.json({ success: false, err: e });
    }
    if (!iferr) {
      res.json({ success: true, sameAuthor: false, result: _result, ingred: _ingred });
    }
    connection.release();
  }
});

router.put("/recipe/:recipeID", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    await connection.beginTransaction();
    const currdate = getTimeAsString();
    try {
      const result = await connection.query(
        `
        UPDATE recipes SET name = ?, recipe = ?, modifyDate = ? WHERE id = ?;`,
        [req.body.recipeName, req.body.recipeBody, currdate, req.body.recipeID]
      );
      console.log(req.body);
      const ingList = JSON.parse(req.body.recipeIngred);
      console.log(ingList);
      const delResult = await connection.query(
        `
        DELETE FROM ingred_recipe WHERE recipe_id = ?;`,
        [req.body.recipeID]
      );
      for await (elem of ingList) {
        const ingName = elem.kind;
        const result3 = await connection.query(`SELECT id FROM ingredients WHERE kind = ?`, [ingName]);
        if (result3[0][0] === undefined) {
          const result4 = await connection.query(`INSERT INTO ingredients(kind) VALUE(?);`, [ingName]);
          const result5 = await connection.query(
            `
          INSERT INTO ingred_recipe(recipe_id, ingred_id)
          VALUE(?, (SELECT LAST_INSERT_ID()));`,
            [req.body.recipeID]
          );
        } else {
          const iid = result3[0][0].id;
          const result6 = await connection.query(
            `INSERT INTO ingred_recipe(recipe_id, ingred_id)
              VALUE(?, ?);`,
            [req.body.recipeID, iid]
          );
        }
      }
    } catch (e) {
      await connection.rollback();
      iferr = true;
      console.log(e);
      res.json({
        success: false,
        message: "Modify failed.",
      });
    }
    if (!iferr) {
      await connection.commit();
      res.json({
        success: true,
        message: "Modify success.",
      });
    }
    connection.release();
  } else
    res.json({
      success: false,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
});

module.exports = router;
