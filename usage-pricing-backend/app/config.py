from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_DB: str

    class Config:
        env_file = ".env"

settings = Settings()