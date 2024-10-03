const {login,signup,profile,getAllUsers,logOut} = require("../controllers/userController");
  
  const router = require("express").Router();
  
  
  router.post("/signup", signup);
  router.post("/login", login);
  router.post("/profile/:id", profile);
  router.get("/allusers/:id", getAllUsers);
  router.get("/logout/:id", logOut);
  
 
  
  module.exports = router;
  