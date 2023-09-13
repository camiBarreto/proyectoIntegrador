const express = require("express");
const router = express.Router();
const controllerUser = require("../controllers/usersController");
const authMiddleware = require('../middlewares/authMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


//@ GET /users/login
router.get("/login", guestMiddleware, controllerUser.login);
//@ POST /users/login/post
router.post("/login/post", controllerUser.processLogin);

//@ GET /users/register
router.get("/register",guestMiddleware, controllerUser.register);
//@ POST /users/post
router.post("/post", controllerUser.postUser);

//@ GET /users/:id/editUser
router.get ("/:id/editUser",controllerUser.getEditUser)
//@ PUT /users/:id/put/user
router.put("/:id/put/user", controllerUser.putEditUser)


//@ GET /users/create
router.get("/create", controllerUser.getCreateAdmin);
//@ POST /users/post/admin
router.post("/post/admin", controllerUser.postAdmin);

//@ GET /users/:id/editAdmin
router.get ("/:id/editAdmin",controllerUser.getEditAdmin)
//@ PUT /users/put/admin
router.put("/:id/put/admin", controllerUser.putEditAdmin)

//@ GET /users/admin
router.get("/admin",adminMiddleware, controllerUser.admin);

//@ GET /users/logOut
router.get("/logOut",authMiddleware, controllerUser.logOut);

//@ GET /users/profile
router.get("/profile",authMiddleware, controllerUser.profile);

module.exports = router;
