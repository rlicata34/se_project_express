const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const handleError = require("../utils/errorHandler");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res ) => handleError());

module.exports = router;