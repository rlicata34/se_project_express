const ClothingItem = require("../models/clothingitem");
const handleError = require("../utils/errors");


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


// Add new error code and message to utils
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.user._id;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return Promise.reject(new Error("You do not have permission to delete this item"));
      }
      return res.send({ message: "Clothing item deleted successfully", item })
    })
    .catch((err) => handleError(err, res));
};

const likeItem = (req, res) => {
  const { userId } = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: {userId} } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item liked successfully", item}))
    .catch((err) => handleError(err, res));
};

const dislikeItem = (req, res) => {
  const { userId } = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: {userId} } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item disliked successfully", item}))
    .catch((err) => handleError(err, res));
}

module.exports =  { getItems, createItem, deleteItem, likeItem, dislikeItem };

