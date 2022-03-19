const router = require("express").Router();
const controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
//get /dishes
//post /dishes
router
    .route("/")
    .get(controller.getAllDishes)
    .post(controller.create)

//get /dishes/:dishId
//put /dishes/:dishId
router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)

module.exports = router;
