from fastapi import FastAPI
from app.core.config import settings

# Initialize the FastAPI app
app = FastAPI(title=settings.APP_NAME)

@app.get("/")
def read_root():
    """
    The landing page of your API.
    """
    return {
        "status": "online",
        "message": "Welcome to the Battlestation Backend",
        "version": "1.0.0"
    }

@app.get("/status")
def get_health():
    return {"health": "OK"}

@app.get("/users/{user_id}")
def read_user(user_id: int, include_details: bool = False):
    """
    An example of a path parameter (user_id) 
    and a query parameter (include_details).
    """
    user_data = {"user_id": user_id}
    if include_details:
        user_data.update({"role": "Commander", "level": 99})
    return user_data

@app.get("/info")
def get_info():
    return {
        "app_name": settings.APP_NAME,
        "debug_status": settings.DEBUG_MODE
    }