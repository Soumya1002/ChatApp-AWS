// Import necessary modules
const express = require('express');
const router = express.Router();

// Define route handler for /previouschats
router.get('/previouschats', async (req, res) => {
  try {
    // Extract query parameters
    const { firstMsgId, gpId } = req.query;

    // Fetch previous chats from the database
    // Replace this with your actual database query to fetch previous chats
    const previousChats = await archiveChats.find({
      groupchatId: gpId,
      messageId: { $lt: firstMsgId } // Fetch messages older than firstMsgId
    }).sort({ messageId: -1 }).limit(10); // Limit the number of messages to fetch

    // Send the fetched chats as the response
    res.status(200).json({ chats: previousChats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
