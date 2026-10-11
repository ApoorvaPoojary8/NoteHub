
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError

from app.config import settings
from app.database import (
    client,
    users_collection,
    notes_collection,
    ensure_indexes,
)
from app.dependencies import get_current_user
from app.schemas import (
    UserCreate,
    UserLogin,
    UserPublic,
    TokenResponse,
    NoteCreate,
    NoteUpdate,
    NotePublic,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)


# -------------------- APPLICATION LIFESPAN --------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_indexes()
    yield
    client.close()


app = FastAPI(
    title="NoteHub API",
    version="1.0.0",
    lifespan=lifespan,
)


# -------------------- CORS CONFIGURATION --------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- RESPONSE HELPERS --------------------

def public_user(user) -> UserPublic:
    return UserPublic(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
    )


def public_note(note) -> NotePublic:
    return NotePublic(
        id=str(note["_id"]),
        title=note["title"],
        content=note["content"],
        category=note["category"],
        color=note["color"],
        pinned=note["pinned"],
        created_at=note["created_at"],
        updated_at=note["updated_at"],
    )


# -------------------- HEALTH CHECKS --------------------

@app.get("/")
async def root():
    return {
        "message": "NoteHub API is running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


# -------------------- AUTHENTICATION --------------------

@app.post(
    "/api/auth/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(payload: UserCreate):
    email = payload.email.strip().lower()

    user = {
        "name": payload.name.strip(),
        "email": email,
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = await users_collection.insert_one(user)

    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user["_id"] = result.inserted_id

    return TokenResponse(
        access_token=create_access_token(str(result.inserted_id)),
        user=public_user(user),
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    email = payload.email.strip().lower()

    # Find the account by normalized email.
    user = await users_collection.find_one({"email": email})

    if not user:
        print("Login diagnostic: user not found")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Confirm the stored account has a password hash.
    password_hash = user.get("password_hash")

    if not password_hash:
        print("Login diagnostic: password hash missing")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account password data is missing",
        )

    # Verify the submitted password.
    try:
        password_matches = verify_password(
            payload.password,
            password_hash,
        )

    except (ValueError, TypeError):
        print("Login diagnostic: password hash verification failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify this account's password",
        )

    if not password_matches:
        print("Login diagnostic: password does not match")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Authentication succeeded.
    return TokenResponse(
        access_token=create_access_token(str(user["_id"])),
        user=public_user(user),
    )


@app.get("/api/auth/me", response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return public_user(user)


# -------------------- NOTES: LIST AND SEARCH --------------------

@app.get("/api/notes", response_model=list[NotePublic])
async def list_notes(
    search: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=40),
    user=Depends(get_current_user),
):
    filters = {
        "user_id": str(user["_id"]),
    }

    if category and category.lower() != "all":
        filters["category"] = category

    if search and search.strip():
        filters["$or"] = [
            {
                "title": {
                    "$regex": search.strip(),
                    "$options": "i",
                }
            },
            {
                "content": {
                    "$regex": search.strip(),
                    "$options": "i",
                }
            },
        ]

    cursor = notes_collection.find(filters).sort(
        [
            ("pinned", -1),
            ("updated_at", -1),
        ]
    )

    return [
        public_note(note)
        async for note in cursor
    ]


# -------------------- NOTES: CREATE --------------------

@app.post(
    "/api/notes",
    response_model=NotePublic,
    status_code=status.HTTP_201_CREATED,
)
async def create_note(
    payload: NoteCreate,
    user=Depends(get_current_user),
):
    now = datetime.now(timezone.utc)

    note = {
        **payload.model_dump(),
        "user_id": str(user["_id"]),
        "created_at": now,
        "updated_at": now,
    }

    result = await notes_collection.insert_one(note)
    note["_id"] = result.inserted_id

    return public_note(note)


# -------------------- NOTES: GET ONE --------------------

@app.get("/api/notes/{note_id}", response_model=NotePublic)
async def get_note(
    note_id: str,
    user=Depends(get_current_user),
):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    note = await notes_collection.find_one(
        {
            "_id": ObjectId(note_id),
            "user_id": str(user["_id"]),
        }
    )

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    return public_note(note)


# -------------------- NOTES: UPDATE --------------------

@app.put("/api/notes/{note_id}", response_model=NotePublic)
async def update_note(
    note_id: str,
    payload: NoteUpdate,
    user=Depends(get_current_user),
):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    changes = payload.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    if "title" in changes and changes["title"] is not None:
        changes["title"] = changes["title"].strip()

        if not changes["title"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title cannot be empty",
            )

    changes["updated_at"] = datetime.now(timezone.utc)

    result = await notes_collection.find_one_and_update(
        {
            "_id": ObjectId(note_id),
            "user_id": str(user["_id"]),
        },
        {"$set": changes},
        return_document=True,
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    return public_note(result)


# -------------------- NOTES: DELETE --------------------

@app.delete(
    "/api/notes/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_note(
    note_id: str,
    user=Depends(get_current_user),
):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    result = await notes_collection.delete_one(
        {
            "_id": ObjectId(note_id),
            "user_id": str(user["_id"]),
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    return None
