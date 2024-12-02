const ClothingItem = require("../models/clothingItem");
const handleError = require("../utils/errorHandler");


const getItems = (req, res) => {
  ClothingItem.find({}) 
    .then((items) => res.status(200).send(items))
    .catch((err) => handleError(err, res));
};

const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;
  
    ClothingItem.create({ name, weather, imageUrl, owner: userId })
        .then((item) => res.status(201).send(item))
        .catch((err) => handleError(err, res))
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ message: "Clothing item deleted successfully", item }))
    .catch((err) => handleError(err, res));
};

const likeItem = (req, res) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ message: "Item liked successfully", item}))
    .catch((err) => handleError(err, res));
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ message: "Item disliked successfully", item}))
    .catch((err) => handleError(err, res));
}

module.exports =  { getItems, createItem, deleteItem, likeItem, dislikeItem };

