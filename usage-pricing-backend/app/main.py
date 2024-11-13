from fastapi import FastAPI, Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, UTC
import random

from . import models, database, auth
from .auth import get_current_user


# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    # Find the user
    user = db.query(models.User).filter(
        models.User.username == form_data.username
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if form_data.password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "user_id": user.user_id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/event")
async def create_event(
    db: Session = Depends(database.get_db),
    current_user: models.User = Security(get_current_user)
):
    new_event = models.Event(
        user_id=current_user.user_id,
        endpoint="/",
        execution_time=datetime.now(UTC),
        duration_ms=random.randint(10, 1000),
        response_size_bytes=random.randint(100, 10000),
        status_code=200
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    return new_event
