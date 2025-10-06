from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from datetime import datetime
import os
import shutil

DATABASE_URL = "sqlite:///./nrwb.sqlite3"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

class Fault(Base):
    __tablename__ = "faults"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)
    photo_path = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(Text)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)

class Tip(Base):
    __tablename__ = "tips"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    photo_path = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(Text)
    date = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NRWB API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models

class BillRequest(BaseModel):
    account: str

class BillResponse(BaseModel):
    balance: float
    history: list[dict]

class TokenRequest(BaseModel):
    meter: str
    reference: str

class TokenResponse(BaseModel):
    token: str

# Routes

@app.get("/")
async def root():
    return {"status": "ok", "service": "NRWB API"}

@app.post("/faults")
async def create_fault(
    description: str = Form(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    photo_path = None
    if photo is not None:
        filename = f"fault_{int(datetime.utcnow().timestamp())}_{photo.filename}"
        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        photo_path = f"/uploads/{filename}"
    fault = Fault(description=description, latitude=latitude, longitude=longitude, photo_path=photo_path)
    db.add(fault)
    db.commit()
    db.refresh(fault)
    return {"id": fault.id, "photo": photo_path}

@app.get("/faults")
async def list_faults(db: Session = Depends(get_db)):
    rows = db.query(Fault).order_by(Fault.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "description": r.description,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "photo": r.photo_path,
            "created_at": r.created_at.isoformat(),
        }
        for r in rows
    ]

@app.post("/complaints")
async def create_complaint(subject: str = Form(...), db: Session = Depends(get_db)):
    c = Complaint(subject=subject, status="Open")
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "status": c.status}

@app.get("/complaints")
async def list_complaints(db: Session = Depends(get_db)):
    rows = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return [{"id": r.id, "subject": r.subject, "status": r.status, "created_at": r.created_at.isoformat()} for r in rows]

@app.post("/complaints/{cid}/advance")
async def advance_complaint(cid: int, db: Session = Depends(get_db)):
    c = db.query(Complaint).filter(Complaint.id == cid).first()
    if not c:
        return {"error": "Not found"}
    if c.status == "Open":
        c.status = "In Progress"
    elif c.status == "In Progress":
        c.status = "Resolved"
    db.commit()
    db.refresh(c)
    return {"id": c.id, "status": c.status}

@app.post("/tips")
async def create_tip(
    text: str = Form(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    photo_path = None
    if photo is not None:
        filename = f"tip_{int(datetime.utcnow().timestamp())}_{photo.filename}"
        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        photo_path = f"/uploads/{filename}"
    tip = Tip(text=text, latitude=latitude, longitude=longitude, photo_path=photo_path)
    db.add(tip)
    db.commit()
    db.refresh(tip)
    return {"id": tip.id}

@app.get("/announcements")
async def list_announcements(db: Session = Depends(get_db)):
    rows = db.query(Announcement).order_by(Announcement.id.desc()).all()
    return [{"id": r.id, "title": r.title, "body": r.body, "date": r.date} for r in rows]

@app.post("/announcements")
async def create_announcement(title: str = Form(...), body: str = Form(...), date: str = Form(...), db: Session = Depends(get_db)):
    a = Announcement(title=title, body=body, date=date)
    db.add(a)
    db.commit()
    db.refresh(a)
    return {"id": a.id}

@app.post("/bills", response_model=BillResponse)
async def get_bill(req: BillRequest):
    # Placeholder logic
    return BillResponse(
        balance=15200.50,
        history=[
            {"date": "2025-09-03", "amount": -8000, "description": "Payment - Mo626"},
            {"date": "2025-08-15", "amount": 9200, "description": "Bill - August"},
        ],
    )

@app.post("/tokens", response_model=TokenResponse)
async def get_token(req: TokenRequest):
    # Placeholder
    return TokenResponse(token="1234-5678-9012-3456-7890")
