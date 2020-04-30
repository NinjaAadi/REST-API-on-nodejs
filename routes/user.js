const express = require('express');
const Router = express.Router();
const { protect,authorize } = require("../middleware/auth");
//Bring all the functions to the routes
const {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
  createUser
} = require("../controller/user");

//Protection and authorization

Router.use(protect);
Router.use(authorize("admin"));

//all the routes

Router.get('/getallusers',getUser);
Router.get('/getuser/:id',getSingleUser);
Router.post("/createuser", createUser);
Router.put('/updateuser/:id',updateUser);
Router.delete("/deleteuser/:id",deleteUser);

module.exports = Router;
