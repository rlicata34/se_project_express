const router = require("express").Router()
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userid", getUser);
router.post("/", createUser);

module.exports = router;

// curl http://localhost:3001/users