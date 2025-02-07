const ClothingItem = require("../models/clothingitem");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");


const getItems = (req, res, next) => {
  ClothingItem.find({}) 
    .then((items) => res.send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
    const { name, weather, imageUrl } = req.body;
    const userId = req?.user?._id;
  
    ClothingItem.create({ name, weather, imageUrl, owner: userId })
        .then((item) => res.status(201).send(item))
        .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."))
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("You do not have permission to delete this item");
      }
      return item.deleteOne().then(() => res.send({ message: "Item successfully deleted" }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError("Item with the specified ID not found"));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  const userId = req?.user?._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item liked successfully", item}))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError("Item with the specified ID not found"));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req?.user?._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ message: "Item disliked successfully", item}))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError("Item with the specified ID not found"));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError("Invalid request: One or more fields contain invalid data."));
      } else {
        next(err);
      }
    });
}

module.exports =  { getItems, createItem, deleteItem, likeItem, dislikeItem };

