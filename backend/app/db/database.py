from app.core.settings import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
print(settings.database_url+"hello")
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@db:5432/devdb"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine,expire_on_commit=False)