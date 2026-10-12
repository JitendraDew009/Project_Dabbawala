from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import NaiveDatetime
from sqlmodel import SQLModel, Field

# OrderStatus (Enum) -> preparing, picked_up, in_transit,delivered
class OrderStatus(str, Enum):
    preparing = "preparing"
    picked_up = "picked_up"
    in_transit = "in_transit"
    delivered = "delivered"

# database table for Order
class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_name: str
    delivery_address: str
    items: str
    order_status: OrderStatus = Field(default=OrderStatus.preparing)
    created_at: NaiveDatetime = Field(default_factory=datetime.now)
    updated_at: NaiveDatetime = Field(default_factory=datetime.now)

# Schema for creating a new order
class OrderCreate(SQLModel):
    customer_name: str
    delivery_address: str
    items: str

# Schema for updating an order's status
class OrderUpdate(SQLModel):
    status: Optional[OrderStatus] = None
    delivery_address: Optional[str] = None

# status log 
class StatusLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int
    old_status: str
    new_status: str
    changed_at: NaiveDatetime = Field(default_factory=datetime.now)
