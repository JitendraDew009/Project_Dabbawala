from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_session
from models import Order, OrderCreate, OrderUpdate, StatusLog, OrderStatus  
from sqlmodel import Session, select
from datetime import datetime



router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, session: Session = Depends(get_session)):
    db_order = Order(**order.model_dump())
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order

@router.get("/", response_model=list[Order])
def list_orders(
    status: OrderStatus = Query(default= None, description="Filter orders by status"),
    created_date: str = Query(default=None, description="Filter orders by creation date (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0,description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of records to return"),
    session: Session = Depends(get_session)):
    query = select(Order)

    if status:
        query = query.where(Order.order_status == status)

    if created_date:
        start = datetime.combine(created_date, datetime.min.time())
        end = datetime.combine(created_date, datetime.max.time())
        query = query.where(Order.created_at >= start, Order.created_at <= end)

    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)

    return session.exec(query).all()
