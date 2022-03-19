const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//put /dishes/:dishId

//helper function
function findDish(dishId) {
    return dishes.find((dish) => dish.id === Number(dishId));
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

// price property is missing	Dish must include a price
// price property 0 or less	Dish must have a price that is an integer greater than 0
// price property is not an integer	Dish must have a price that is an integer greater than 0
function hasValidPrice(res, req, next) {
    const { data: { price } = {} } = req.body;
    if (!Number(+price) || Number(+price) < 0 || !Number.isInteger(+price)) {
            return next({
                status: 400,
                message: "Dish must have a price that is an integer greater than 0"
            })
        }
    return next();
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


//create lastDishId
let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

//create 
function createDish(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
         id: ++lastDishId,
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
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        hasValidPrice, 
        update
    ],
}
