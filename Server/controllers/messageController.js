const Messages = require("../models/messageModel");
const mongoose = require('mongoose');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        _id: msg._id, // Include _id here
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};


module.exports.deleteMessage = async (req, res, next) => {
  try {
    console.log("the is is=",req.params.id)
    const messageId = req.params.id; 
    
    console.log("Deleting message with ID:", messageId);

    // Validate ObjectId
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: "Invalid message ID." });
    }

    const message = await Messages.findByIdAndDelete(messageId);

    if (message) {
      return res.json({ msg: "Message deleted successfully." });
    } else {
      return res.status(404).json({ msg: "Message not found." });
    }
  } catch (ex) {
    next(ex);
  }
};
