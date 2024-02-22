const Admin = require("../models/admin");
const Chat = require("../models/chat");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.postChat = async (req, res, next) => {
  const { msg } = req.body;
  const gpId = req.query.gpId;
  console.log(gpId);
  // console.log(msg);
  try {
    const chat = await req.user.createChat({
      message: msg,
      groupchatId: gpId,
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

exports.getChat = async (req, res, next) => {
  const lastMsgId = req.query.lastMsgId;
  const gpId = req.query.gpId;
  try {
    const chats = await Chat.findAll({
      where: { id: { [Op.gt]: lastMsgId }, groupchatId: gpId },
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    const adminRecord = await Admin.findAll({
      where: {
        userId: req.user.id,
        groupchatId: gpId,
      },
    });
    const isAdmin = adminRecord.length !== 0;
    res.json({
      success: true,
      chats: chats,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

// New endpoint for loading previous chats from archived database
exports.getArchivedChat = async (req, res, next) => {
  const lastMsgId = req.query.lastMsgId;
  const gpId = req.query.gpId;

  try {
    // Fetch chats from the archived chat database
    const archivedChats = await ArchivedChat.findAll({
      where: { id: { [Op.lt]: lastMsgId }, groupchatId: gpId },
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });

    res.json({
      success: true,
      chats: archivedChats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

// Client-side code can call this endpoint when the "load previous chat" button is clicked
// Example usage:
// GET /api/archived-chat?lastMsgId=123&gpId=456


