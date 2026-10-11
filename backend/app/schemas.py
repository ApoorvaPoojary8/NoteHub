from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic

class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    content: str = Field(default="", max_length=50000)
    category: str = Field(default="Personal", max_length=40)
    color: str = Field(default="orange", max_length=20)
    pinned: bool = False

class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    content: str | None = Field(default=None, max_length=50000)
    category: str | None = Field(default=None, max_length=40)
    color: str | None = Field(default=None, max_length=20)
    pinned: bool | None = None

class NotePublic(BaseModel):
    id: str
    title: str
    content: str
    category: str
    color: str
    pinned: bool
    created_at: datetime
    updated_at: datetime
