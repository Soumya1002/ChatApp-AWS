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


// Controller function to fetch archived chat data
exports.getArchivedChat = async (req, res, next) => {
  const gpId = req.query.groupId; // Extract the group ID from the request query

  try {
    // Fetch archived chat data for the specified group ID
    const archivedChats = await Chat.findAll({
      where: {
        groupchatId: gpId,
        createdAt: {
          [Op.lt]: new Date(), // Fetch chats created before today
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 1)), // Assuming you want chats from yesterday
        },
      },
    });

    // Send the archived chat data as a response
    res.json({
      success: true,
      archivedChats: archivedChats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Error fetching archived chat data",
    });
  }
};



