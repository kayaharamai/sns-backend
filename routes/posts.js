const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("posts Router");
});

module.exports = router;
