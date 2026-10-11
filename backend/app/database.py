from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
database = client[settings.database_name]

users_collection = database["users"]
notes_collection = database["notes"]

async def ensure_indexes():
    await users_collection.create_index("email", unique=True)
    await notes_collection.create_index([("user_id", 1), ("updated_at", -1)])
