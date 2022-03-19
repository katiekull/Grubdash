const path = require("path");

//get /orders
//post /orders 
//get /orders/:orderId
//put /orders/:orderId
//delete /orders/:orderId

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
