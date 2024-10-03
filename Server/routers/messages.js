const { addMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.delete('/deletemessage/:id', deleteMessage);

module.exports = router;
