const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * @desc    Get AI response for chatbot
 * @route   POST /api/chat
 * @access  Public
 */
exports.getChatResponse = async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response if no API key is set
      return res.json({ 
        response: "Hello! I'm your AI assistant. To provide real-time responses, please configure my API key in the environment variables. For now, I can tell you that Avinash is an expert in MEAN stack development!",
        isMock: true
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are a helpful AI assistant for Avinash's professional portfolio website. You help visitors learn about Avinash's skills (MEAN stack, Angular, Node.js), projects, and experience. Be polite, professional, and concise. If you don't know something specific about Avinash, advise the visitor to use the contact form."
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.json({ response: text, isMock: false });
  } catch (error) {
    console.error('Chat AI Error:', error);
    
    // Fallback response instead of 500 status to keep UI clean
    let fallbackMsg = "Hello! I'm Avinash's AI personal assistant. I'm currently having a bit of trouble reaching my knowledge base, but I'd be happy to help you with the basics. Avinash is a highly skilled MEAN stack developer with expertise in Angular, Node.js, and MongoDB. You can check his projects and experience in the main sections of this site!";
    
    // Customize fallback message based on error
    if (error.message.toLowerCase().includes('location') || error.message.toLowerCase().includes('supported')) {
      fallbackMsg = "Hi there! I'm Avinash's AI assistant. My AI service is currently restricted in this server's region, but I can still tell you about Avinash's professional background. He is an expert in MEAN stack development and has built several impressive projects. Feel free to explore the site or use the contact form to reach him directly!";
    }

    // Always returning 200 OK to prevent generic frontend "trouble connecting" messages
    return res.json({ 
      response: fallbackMsg, 
      isMock: true,
      error: error.message 
    });
  }
};
