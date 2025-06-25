import "./styles/MessageItem.css"

const MessageItem = ({ message }) => {
  const { text, sender, timestamp, isSearch } = message

  const formatMessageWithThinking = (text) => {
    if (typeof text !== "string" || !text.includes("</think>")) {
      return { thinking: null, message: text }
    }

    const parts = text.split("</think>")
    return {
      thinking: parts[0],
      message: parts[1],
    }
  }

  // Handle search results from AI service
  if (sender === "bot" && isSearch) {
    try {
      // If this is a search result message from the bot
      const results = Array.isArray(text) ? text : [text];

      return (
        <div className={`message ${sender}-message`}>
          <div className="search-results-container">
            <h3 className="search-results-heading">Search Results</h3>
            {results.map((result, index) => (
              <div key={index} className="search-result">
                <h3 className="result-title">{result.title}</h3>
                <p className="result-content">{result.content}</p>
                {result.link && (
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-link">
                    View Resource
                  </a>
                )}
                {result.image && (
                  <div className="result-image-container">
                    <img src={result.image} alt={result.title} className="result-image" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="message-timestamp">{timestamp}</div>
        </div>
      )
    } catch (error) {
      console.error("Failed to render search results:", error)
      // Fallback to regular message display if rendering fails
    }
  }

  const { thinking, message: formattedMessage } = formatMessageWithThinking(
    typeof text === "string" ? text : JSON.stringify(text)
  )

  return (
    <div className={`message ${sender}-message`}>
      {thinking && <div className="thinking-section">{thinking}</div>}
      <div className="message-content">{formattedMessage}</div>
      <div className="message-timestamp">{timestamp}</div>
    </div>
  )
}

export default MessageItem