const router = require("express").Router()
const { auth } = require("../middlewares/auth");
const { validateUpdateUserBody } = require("../middlewares/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUserBody, updateProfile);

module.exports = router;

