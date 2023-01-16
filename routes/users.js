const router = require("express").Router();


//データの挿入
router.get("/", (req, res) => {
  res.send("user Router");
});

module.exports = router;
