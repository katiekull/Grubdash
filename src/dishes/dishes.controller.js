const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//helper function
function findDish(dishId) {
    return dishes.find((dish) => dish.id === dishId);
}

//list all dishes
function getAllDishes(req, res) {
    res.status(200).json({ data: dishes })
};

//check to see if dish exists if not return 404
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = findDish(dishId);

    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    } else {
        return next({
            status: 404,
            message: `Dish id not found ${dishId}`
        });
    }
};

//get one dish
function getDish(req, res) {
    const { dishId } = req.params;
    const foundDish = findDish(dishId);
    res.status(200).json({ data: foundDish });
};

//check if dish.id matches
function dishIdExists(req, res, next) {
    const { data: { id } = {} } = req.body;
    const dishId = req.params.dishId;
    if (id !== undefined && id !== null && id !== "" && id !== dishId) {
      next({
        status: 400,
        message: `id ${id} must match dataId provided in parameters`,
      });
    }
     return next();
  };

// price property is missing	Dish must include a price
// price property 0 or less	Dish must have a price that is an integer greater than 0
// price property is not an integer	Dish must have a price that is an integer greater than 0
function hasValidPrice(req, res, next) {
    const { data: { price } = {} } = req.body;
        if (
            req.body.data.price === null ||
            req.body.data.price === "" ||
            req.body.data.price === undefined
        ) {
            next({ status: 400, message: "Dish must include a price." });
        }
        if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
        return next();
    } else {
        next({
        status: 400,
        message: `The price must be a number greater than 0.`,
        });
    }
}

// name property is missing	Dish must include a name
// name property is empty ""	Dish must include a name
// description property is missing	Dish must include a description
// description property is empty ""	Dish must include a description
// image_url property is missing	Dish must include a image_url
// image_url property is empty ""	Dish must include a image_url
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      return next({ status: 400, message: `Must include a ${propertyName}` });
    };
  }

//create 
function createDish(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
         id: nextId(),
         name,
         description,
         price,
         image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function update(req, res) {
    const existingDish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    existingDish.name = name;
    existingDish.description = description;
    existingDish.price = price;
    existingDish.image_url = image_url;
    res.status(200).json({ data: existingDish });   
}


module.exports = {
    getAllDishes,
    read: [dishExists, getDish],
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        hasValidPrice,
        createDish
    ],
    update: [
        dishExists, 
        dishIdExists,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        hasValidPrice, 
        update
    ],
}
