import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Create router
const router = express.Router();

// Load environment variables
dotenv.config();

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * POST /api/ai-assistant
 * Endpoint for AI assistant interactions
 */
router.post('/ai-assistant', async (req, res) => {
  try {
    const { message, mode } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Different system prompts based on mode
    const systemPrompt = mode === 'search' 
      ? "You are an educational search assistant. Return results in JSON format with title, content, link and image properties."
      : "You are an educational assistant for an LMS platform. Provide helpful, accurate, and concise answers for students.";

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // You can fall back to gpt-3.5-turbo if needed
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Format response based on mode
    if (mode === 'search') {
      try {
        // Try to parse the response as JSON for search results
        const responseText = completion.choices[0].message.content;
        const searchResults = JSON.parse(responseText);
        return res.json({ results: searchResults });
      } catch (e) {
        // Fallback if response isn't valid JSON
        return res.json({ 
          results: [{
            title: "AI Generated Response",
            content: completion.choices[0].message.content,
            link: "#",
            image: "https://source.unsplash.com/random/300x200/?education"
          }]
        });
      }
    } else {
      // Return standard chat response
      return res.json({ 
        response: completion.choices[0].message.content 
      });
    }
  } catch (error) {
    console.error('AI Assistant error:', error);
    return res.status(500).json({ 
      error: 'Error processing request',
      message: error.message
    });
  }
});

export default router; 