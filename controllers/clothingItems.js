const ClothingItem = require("../models/clothingitem");
const { handleError, ERROR_CODES } = require("../utils/errors");


const getItems = (req, res) => {
  ClothingItem.find({}) 
    .then((items) => res.send(items))
    .catch((err) => handleError(err, res));
};

const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    const userId = req?.user?._id;
  
    ClothingItem.create({ name, weather, imageUrl, owner: userId })
        .then((item) => res.status(201).send(item))
        .catch((err) => handleError(err, res))
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" })
      }
      return item.deleteOne().then(() => res.send({ message: "Item successfully deleted" }));
    })
    .catch((err) => handleError(err, res));
};

const likeItem = (req, res) => {
  const userId = req?.user?._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item liked successfully", item}))
    .catch((err) => handleError(err, res));
};

const dislikeItem = (req, res) => {
  const userId = req?.user?._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item disliked successfully", item}))
    .catch((err) => handleError(err, res));
}

module.exports =  { getItems, createItem, deleteItem, likeItem, dislikeItem };

