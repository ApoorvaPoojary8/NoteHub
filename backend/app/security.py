
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.config import settings

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(
        {"sub": user_id, "exp": expires},
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[ALGORITHM],
        )
        return payload.get("sub")
    except JWTError:
        return None


if __name__ == "__main__":
    test_password = "TestPass123!"
    test_hash = hash_password(test_password)

    print("Hash created:", bool(test_hash))
    print("Verification:", verify_password(test_password, test_hash))
