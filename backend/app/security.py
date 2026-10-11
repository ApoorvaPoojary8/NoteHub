from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(user_id: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode({"sub": user_id, "exp": expires}, settings.secret_key, algorithm=ALGORITHM)

def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

if __name__ == "__main__":
    test_password = "TestPass123!"
    test_hash = hash_password(test_password)

    print("Hash created:", bool(test_hash))
    print("Verification:", verify_password(test_password, test_hash))