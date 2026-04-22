from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost/moodmosaic"
    secret_key: str = "moodmosaic-secret-change-in-production"
    cors_origins: List[str] = ["http://localhost:5173"]
    deepseek_api_key: str = ""
    deepseek_api_url: str = "https://api.deepseek.com/v1/chat/completions"
    class Config:
        env_file = ".env"

settings = Settings()
