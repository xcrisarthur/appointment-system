const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CREATE user
router.post("/", userController.createUser);

// READ all users
router.get("/", userController.getUsers);

// READ one user
router.get("/:id", userController.getUserById);

// UPDATE user
router.put("/:id", userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

module.exports = router;
