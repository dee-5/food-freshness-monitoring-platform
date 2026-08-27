from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
import models
import schemas
import auth

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Food freshness API is alive"}

@app.get("/food/{food_name}")
def get_food(food_name: str):
    return {"food": food_name, "status": "checking freshness..."}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=auth.hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = auth.create_access_token(data={"sub": db_user.email})

    return {"access_token": access_token, "token_type": "bearer"}
@app.post("/food", response_model=schemas.FoodItemOut)
def add_food(
    food: schemas.FoodItemCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(auth.get_current_user_email),
):
    current_user = db.query(models.User).filter(models.User.email == current_user_email).first()

    new_food = models.FoodItem(
        name=food.name,
        category=food.category,
        quantity=food.quantity,
        expiry_date=food.expiry_date,
        owner_id=current_user.id,
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


@app.get("/food", response_model=list[schemas.FoodItemOut])
def list_food(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(auth.get_current_user_email),
):
    current_user = db.query(models.User).filter(models.User.email == current_user_email).first()

    return db.query(models.FoodItem).filter(models.FoodItem.owner_id == current_user.id).all()
@app.put("/food/{food_id}", response_model=schemas.FoodItemOut)
def update_food(
    food_id: int,
    food: schemas.FoodItemCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(auth.get_current_user_email),
):
    current_user = db.query(models.User).filter(models.User.email == current_user_email).first()

    food_item = db.query(models.FoodItem).filter(
        models.FoodItem.id == food_id,
        models.FoodItem.owner_id == current_user.id,
    ).first()

    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    food_item.name = food.name
    food_item.category = food.category
    food_item.quantity = food.quantity
    food_item.expiry_date = food.expiry_date

    db.commit()
    db.refresh(food_item)

    return food_item


@app.delete("/food/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(auth.get_current_user_email),
):
    current_user = db.query(models.User).filter(models.User.email == current_user_email).first()

    food_item = db.query(models.FoodItem).filter(
        models.FoodItem.id == food_id,
        models.FoodItem.owner_id == current_user.id,
    ).first()

    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    db.delete(food_item)
    db.commit()

    return {"message": "Food item deleted successfully"}