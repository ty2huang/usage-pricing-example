from sqlalchemy import Column, Integer, String, DateTime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    user_id = Column(String, unique=True, index=True)
    password = Column(String)


class Event(Base):
    __tablename__ = "api_execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    endpoint = Column(String)
    execution_time = Column(DateTime)
    duration_ms = Column(Integer)
    response_size_bytes = Column(Integer)
    status_code = Column(Integer)
