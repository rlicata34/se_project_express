const router = require("express").Router()
const { createUser, login, getCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;

