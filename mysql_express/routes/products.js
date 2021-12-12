var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
const upload = multer();
var conn = require("./db");
const { getTimeAsString } = require("./mydate");
const conn2 = require("./asyncdb");

router.get("/", async function (req, res, next) {
  const connection = await conn2.getConnection(async (__conn) => __conn);
  var iferr = false;
  var _result = null;
  await connection.beginTransaction();
  const UID = req.session.UID;
  try {
    const result = await connection.query(
      `
        SELECT products.id as id, name, kind, seller, amount, price FROM products
        LEFT JOIN ingredients ON kind_id = ingredients.id
        LEFT JOIN (SELECT uid, id as seller FROM users) users ON seller_id = users.uid;
        `
    );
    if (result[0][0] !== undefined) _result = result[0];
    else throw "NOT FOUND!";
  } catch (e) {
    await connection.rollback();
    console.log(e);
    res.json({ success: false, err: e });
    iferr = true;
  }
  if (!iferr) {
    await connection.commit();
    res.json({ success: true, result: _result });
  }
  connection.release();
});
router.get("/get/:prodID", async function (req, res, next) {
  const connection = await conn2.getConnection(async (__conn) => __conn);
  var iferr = false;
  var _result = null;
  await connection.beginTransaction();
  const prodID = req.params.prodID;
  try {
    const result = await connection.query(
      `
          SELECT products.id as id, name, kind, seller, amount, price FROM products
          LEFT JOIN ingredients ON kind_id = ingredients.id
          LEFT JOIN (SELECT uid, id as seller FROM users) users ON seller_id = users.uid
          WHERE products.id = ?;
          `,
      [prodID]
    );
    if (result[0][0] !== undefined) _result = result[0][0];
    else throw "NOT FOUND!";
  } catch (e) {
    await connection.rollback();
    console.log(e);
    res.json({ success: false, err: e });
    iferr = true;
  }
  if (!iferr) {
    await connection.commit();
    res.json({ success: true, result: _result });
  }
  connection.release();
});
router.get("/form", async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var _ingreds = [];
    var iferr = false;
    await connection.beginTransaction();
    try {
      const ingreds = await connection.query(
        `
        SELECT * FROM ingredients;`
      );
      if (ingreds[0][0] !== undefined) _ingreds = ingreds[0];
      else throw "NOT FOUND!";
    } catch (err) {
      console.log(err);
      await connection.rollback();
      res.json({
        success: false,
        er: err,
      });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({
        success: true,
        ingreds: _ingreds,
      });
    }
    connection.release();
  } else {
    res.json({
      success: false,
      NOT_LOGINED: true,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
  }
});

router.post("/form/kind", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    var _kindID = null;
    await connection.beginTransaction();
    try {
      const result = await connection.query(
        `
          SELECT * FROM ingredients where kind = ?;
          `,
        [req.body.ingredInput]
      );
      if (result[0].length !== 0) throw "Already exists.";
      else {
        const insResult = await connection.query(
          `
          INSERT INTO ingredients(kind) VALUE(?);
          `,
          [req.body.ingredInput]
        );
        const lastID = await connection.query(
          `
              SELECT LAST_INSERT_ID() as lid;
            `,
          [req.body.ingredInput]
        );
        if (lastID[0][0].lid === undefined) throw "ERROR";
        _kindID = lastID[0][0].lid;
      }
    } catch (err) {
      console.log("/api/products/form :", err);
      await connection.rollback();
      res.json({
        success: false,
        err: err,
      });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({
        success: true,
        kindID: _kindID,
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
router.post("/form", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    var iferr = false;
    var _kindID = null;
    await connection.beginTransaction();
    try {
      const result = await connection.query(
        `
         INSERT INTO products(name, amount, price, kind_id, seller_id) 
         VALUE(?, ?, ?, ?, ?);
          `,
        [req.body.prodName, req.body.prodAmount, req.body.prodPrice, req.body.prodKind, req.session.UID]
      );
    } catch (err) {
      console.log(err);
      await connection.rollback();
      res.json({
        success: false,
        formErr: err,
      });
      iferr = true;
    }
    if (!iferr) {
      await connection.commit();
      res.json({
        success: true,
      });
    }
    connection.release();
  } else {
    res.json({
      success: false,
      NOT_LOGINED: true,
      message: "not logined.",
      formErr: ["로그인이 필요한 서비스입니다."],
    });
  }
});
router.post("/order", upload.none(), async function (req, res, next) {
  if (req.session.isLogined) {
    const connection = await conn2.getConnection(async (__conn) => __conn);
    const UID = req.session.UID;
    const prodID = req.body.prodID;
    const buyAmount = req.body.buyAmount;
    const currdate = getTimeAsString();
    await connection.beginTransaction();
    try {
      const seller = await connection.query(
        `
    SELECT seller_id FROM products WHERE id = ?`,
        [prodID]
      );
      if (seller[0][0].seller_id === undefined) throw "NOT FOUND PRODUCTS";
      const seller_id = seller[0][0].seller_id;
      await connection.query(
        `
    INSERT INTO orders(buyer_id, seller_id, food_id, orderDate, orderAmount)
    VALUE(?, ?, ?, ?, ?)
    `,
        [UID, seller_id, prodID, currdate, buyAmount]
      );

      await connection.commit();
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      await connection.rollback();
      res.json({
        success: false,
        err: err,
      });
    }
    connection.release();
  } else {
    res.json({
      success: false,
      err: "NOT LOGINED",
      NOT_LOGINED: true,
    });
  }
});

router.get("/kind/:currkind", async function (req, res, next) {
  const currkind = req.params.currkind;
  const connection = await conn2.getConnection(async (__conn) => __conn);
  const UID = req.session.UID;
  const buyAmount = req.body.buyAmount;
  await connection.beginTransaction();
  try {
    const result = await connection.query(
      `
    SELECT id, name, kind_id, price, amount, seller_id, seller FROM products 
    LEFT JOIN (SELECT uid, id as seller FROM users) U ON  U.uid = seller_id
    WHERE kind_id = ?; 
    `,
      [currkind]
    );

    const kindName = await connection.query(
      `
    SELECT kind FROM ingredients where id = ?; 
    `,
      [currkind]
    );
    if (result[0].length === 0) throw "PRODUCT NOT FOUND";
    if (kindName[0][0] === undefined) throw "KIND NOT FOUND";
    await connection.commit();

    res.json({ success: true, result: result[0], kind: kindName[0][0].kind });
  } catch (error) {
    await connection.rollback();
    res.json({ success: false, err: error });
  }
  connection.release();
});

router.delete("/del/:prodID", async function (req, res, next) {
  if (req.session.isLogined) {
    const delProd = req.params.prodID;
    const connection = await conn2.getConnection(async (__conn) => __conn);
    await connection.beginTransaction();
    try {
      const checkSameSeller = await connection.query(
        `
        SELECT seller_id FROM products WHERE id = ? 
        `,
        [delProd]
      );
      if (req.session.UID !== checkSameSeller[0][0].seller_id) throw `NOT SAME SELLER`;
      const result = await connection.query(
        `
        DELETE FROM products WHERE id = ?
      `,
        [delProd]
      );
      console.log(result);
      await connection.commit();
      res.json({ success: true, msg: "Delete success." });
    } catch (error) {
      console.log(error);
      await connection.rollback();
      res.json({ success: false, err: error });
    }
    connection.release();
  } else {
    res.json({ success: false, NOT_LOGINED: true });
  }
});

module.exports = router;
