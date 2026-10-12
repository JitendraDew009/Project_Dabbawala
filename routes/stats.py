from datetime import datetime, date
from fastapi import APIRouter, Depends, Query
from database import get_session
from models import Order, OrderStatus
from sqlmodel import Session, select, func

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/daily")
def daily_summary(
    summary_date: date | None = Query(default=None, description="Date for which to get the summary (YYYY-MM-DD)"), 
    session: Session = Depends(get_session)
):
    if summary_date is None:
        summary_date = datetime.today()

    start = datetime.combine(summary_date, datetime.min.time())
    end = datetime.combine(summary_date, datetime.max.time())

    summary_query = {}
    total = 0

    for status in OrderStatus:
        count = session.exec(
            select(func.count(Order.id)).where(
                Order.status == status, 
                Order.created_at >= start, 
                Order.created_at <= end)
        ).one()
        summary_query[status.value] = count
        total += count
    return {
        "date": summary_date.isoformat(),
        "total_orders": total,
        "by_status": summary_query
    }