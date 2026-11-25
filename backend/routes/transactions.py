
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal

from backend.services.tracking_service import (
    create_transaction,
    update_transaction,
    get_impact_statistics
)

router = APIRouter()

ActionType = Literal[
    "DONATE",
    "REPAIR",
    "REUSE",
    "RECYCLE"
]

TransactionStatus = Literal[
    "pending",
    "accepted",
    "completed",
    "rejected"
]


class TransactionCreate(BaseModel):
    item_name: str = Field(min_length=1)
    action: ActionType
    weight_kg: float = Field(gt=0)
    organization_name: Optional[str] = None


class TransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    verified: Optional[bool] = None


@router.post("/transactions")
def add_transaction(transaction: TransactionCreate):
    try:
        result = create_transaction(
            item_name=transaction.item_name,
            action=transaction.action,
            weight_kg=transaction.weight_kg,
            organization_name=transaction.organization_name
        )

        return {
            "message": "Transaction created successfully",
            "transaction": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.patch("/transactions/{transaction_id}")
def edit_transaction(
    transaction_id: int,
    update: TransactionUpdate
):
    if update.status is None and update.verified is None:
        raise HTTPException(
            status_code=400,
            detail="Provide status or verified to update"
        )

    try:
        result = update_transaction(
            transaction_id=transaction_id,
            status=update.status,
            verified=update.verified
        )

        if result is None:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found"
            )

        return {
            "message": "Transaction updated successfully",
            "transaction": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/dashboard/impact")
def impact_dashboard():
    result = get_impact_statistics()

    return {
        "message": "Impact statistics retrieved successfully",
        "impact": result
    }
