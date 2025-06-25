// AI Service - Interface for OpenAI GPT-4o integration

// This service handles communication with OpenAI API
// API keys should be stored securely in environment variables on the server
// Client-side code should never contain API keys

/**
 * Send a message to GPT-4o and get a response
 * This should be called from a backend API, never directly from the frontend
 * @param {string} userMessage - The message from the user
 * @param {string} mode - 'chat' or 'search'
 * @returns {Promise<Object>} - The AI response
 */
export const sendMessageToAI = async (userMessage, mode) => {
  try {
    // In a real implementation, this would be a fetch to your backend API
    // which would then securely access the OpenAI API with your keys
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        mode: mode
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
};

/**
 * Mock function for development that simulates AI responses
 * Use this for development instead of making actual API calls
 * @param {string} userMessage - The message from the user
 * @param {string} mode - 'chat' or 'search'
 * @returns {Promise<Object>} - The simulated AI response
 */
export const getMockAIResponse = async (userMessage, mode) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockResponses = {
    chat: [
      "That's an excellent question! Based on the course materials, you should focus on understanding the core concepts first...",
      "I'd recommend starting with Chapter 3 in your textbook, which covers this topic in detail...",
      "This is a common challenge for students. Let me break it down into simpler steps...",
      "According to the latest research in this field, there are several approaches you could take...",
      "Great question! Let me explain how this concept relates to what you learned in the previous module..."
    ],
    search: [
      {
        results: [
          {
            title: "Introduction to AI - Learning Guide",
            content: "A comprehensive guide covering fundamental AI concepts, machine learning basics, and practical applications.",
            link: "/courses/ai-fundamentals",
            image: "https://source.unsplash.com/random/300x200/?ai"
          },
          {
            title: "Advanced Programming Techniques",
            content: "Explore modern programming patterns, optimization strategies, and code quality best practices.",
            link: "/courses/advanced-programming",
            image: "https://source.unsplash.com/random/300x200/?programming"
          },
          {
            title: "Data Analysis Workshop",
            content: "Hands-on tutorials for data processing, visualization, and statistical analysis using popular tools.",
            link: "/courses/data-analysis",
            image: "https://source.unsplash.com/random/300x200/?data"
          }
        ]
      }
    ]
  };

  // Select a random response based on the mode
  if (mode === 'search') {
    return mockResponses.search[0];
  } else {
    const randomIndex = Math.floor(Math.random() * mockResponses.chat.length);
    return { response: mockResponses.chat[randomIndex] };
  }
}; 