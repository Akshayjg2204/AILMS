from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import uvicorn
import json

app = FastAPI(
    title="AILMS API Gateway",
    description="API Gateway for AILMS services",
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

# Service routing configuration
SERVICE_ROUTES = {
    "/chat": "http://127.0.0.1:8002",  # Chatbot service on 8002
    "/api/search": "http://127.0.0.1:8002",  # Chatbot search
    "/api/profile": "http://127.0.0.1:5000/api/profile",  # Node.js backend profile API
    "/health": "http://127.0.0.1:5000/health",  # Node.js health check
}

# Create a client for forwarding requests
client = httpx.AsyncClient()

@app.get("/")
async def root():
    return {"message": "Welcome to AILMS API Gateway", "services": list(SERVICE_ROUTES.keys())}

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(request: Request, path: str):
    # Get full path including query params
    full_path = request.url.path
    target_service = None
    
    # Find the matching service route
    for route_prefix, service_url in SERVICE_ROUTES.items():
        if full_path.startswith(route_prefix):
            target_service = service_url
            break
    
    # If no matching service is found, return an error
    if not target_service:
        raise HTTPException(status_code=404, detail=f"No service configured for path: {full_path}")
    
    # Construct the target URL by replacing the path prefix
    target_url = f"{target_service}{full_path}"
    if request.url.query:
        target_url = f"{target_url}?{request.url.query}"
    
    print(f"Forwarding request to: {target_url}")
    
    # Get the request body
    body = await request.body()
    
    # Get headers but filter out content-length as we'll set it correctly later
    headers = dict(request.headers.items())
    if "content-length" in headers:
        del headers["content-length"]
    
    # Special handling for chatbot requests
    modified_body = body
    if full_path == "/chat" and request.method == "POST" and body:
        try:
            # Parse the original request body
            data = json.loads(body)
            # Check if it's the simple format (message only)
            if "message" in data and isinstance(data["message"], str):
                # Convert to the format expected by the chatbot service
                modified_data = {
                    "messages": [
                        {
                            "role": "user",
                            "content": data["message"]
                        }
                    ],
                    "context": data.get("context", {})
                }
                modified_body = json.dumps(modified_data).encode()
                print(f"Transformed request body: {modified_body}")
        except Exception as e:
            print(f"Error transforming request body: {e}")
    elif full_path == "/api/search" and request.method == "POST" and body:
        try:
            # Parse the original request body
            data = json.loads(body)
            # Check if it contains a query
            if "query" in data and isinstance(data["query"], str):
                # Request is already in the correct format
                modified_body = body
            else:
                # If using different format, convert it
                modified_data = {"query": data.get("message", "")}
                modified_body = json.dumps(modified_data).encode()
                print(f"Transformed search request: {modified_body}")
        except Exception as e:
            print(f"Error transforming search request: {e}")
    
    # Forward the request to the target service
    try:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=modified_body,
        )
        
        # Return the response from the target service
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers),
        )
    except Exception as e:
        print(f"Error forwarding request: {e}")
        raise HTTPException(status_code=502, detail=f"Error connecting to service: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 