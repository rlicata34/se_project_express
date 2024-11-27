const router = require("express").Router();
const { createItem, getItems, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.put("/:itemId/likes", dislikeItem);

module.exports = router;