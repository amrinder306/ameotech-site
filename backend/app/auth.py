# app/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel

SECRET_KEY = os.getenv("AMEOTECH_AUTH_SECRET", "CHANGE_ME_SUPER_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_EMAIL = os.getenv("AMEOTECH_ADMIN_EMAIL", "admin@ameotech.com")
ADMIN_PASSWORD = os.getenv("AMEOTECH_ADMIN_PASSWORD", "Cool@coder1")  # change in env for prod

router = APIRouter(prefix="/auth", tags=["auth"])


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # username == email
    if form_data.username.lower() != ADMIN_EMAIL.lower() or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token({"sub": form_data.username, "is_admin": True})
    return Token(access_token=access_token)
