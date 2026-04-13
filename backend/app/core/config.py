from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "FastAPI App"
    DEBUG_MODE: bool = False
    SECRET_KEY: str

    # This tells Pydantic to read from the .env file
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")

settings = Settings()