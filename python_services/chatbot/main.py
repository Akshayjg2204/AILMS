from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="AILMS Chatbot Service",
    description="API for AI-powered wellness and learning assistance",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    context: Optional[dict] = None

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    results: List[str]

@app.get("/")
async def root():
    return {"message": "Welcome to AILMS Chatbot Service"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # TODO: Implement AI model integration
    return ChatResponse(
        response="I'm here to help you with wellness and learning questions.",
        context={"conversation_id": "temp_id"}
    )

@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    # Mock search results
    sample_results = [
        "Introduction to Computer Science (Free)",
        "Data Science Fundamentals (₹14,999)",
        "Business Analytics and Strategy (₹19,999)",
        "Intermediate Spanish (₹1,699)",
        "Meditation for Beginners"
    ]
    
    query = request.query.lower()
    # Filter results based on query
    filtered_results = [
        result for result in sample_results 
        if query in result.lower()
    ]
    
    # If no results match, return all available courses
    if not filtered_results:
        return SearchResponse(results=[
            f"No exact matches for '{request.query}'. Here are all available courses:",
            *sample_results
        ])
    
    return SearchResponse(results=filtered_results)

@app.get("/context/{conversation_id}")
async def get_conversation_context(conversation_id: str):
    # TODO: Implement conversation history retrieval
    return {"context": {}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 