"""
Order routes — create, list, detail. All require authentication.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_user, get_optional_user
from api.schemas.orders import OrderCreate, OrderItemOut, OrderOut

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, user=Depends(get_optional_user)):
    from orders.models import Order, OrderItem
    from shop.models import Product

    order = Order.objects.create(
        user=user,
        full_name=data.full_name,
        address=data.address,
        phone=data.phone,
        note=data.note,
    )

    total = 0
    for item_data in data.items:
        try:
            product = Product.objects.get(pk=item_data.product_id, is_active=True)
        except Product.DoesNotExist:
            order.delete()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mahsulot #{item_data.product_id} topilmadi.",
            )

        item_total = float(product.price) * item_data.quantity
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            quantity=item_data.quantity,
            size=item_data.size,
            color=item_data.color,
            price=product.price,
        )
        total += item_total

    order.total_amount = total
    order.save(update_fields=["total_amount"])

    # Notify via Telegram
    print(f"[DEBUG ORDERS] Triggering Telegram notification for Order #{order.id}")
    try:
        from api.utils.telegram import send_telegram_order_notification
        send_telegram_order_notification(order)
    except Exception as e:
        print(f"[DEBUG ORDERS] EXCEPTION during notification trigger: {e}")
        # Logging of this error is handled in the utility, we don't want to fail the request
        pass


    return _serialize_order(order)



@router.get("/", response_model=list[OrderOut])
def list_orders(user=Depends(get_current_user)):
    from orders.models import Order

    orders = Order.objects.filter(user=user).prefetch_related("items").order_by("-created_at")
    return [_serialize_order(o) for o in orders]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, user=Depends(get_current_user)):
    from orders.models import Order

    try:
        order = Order.objects.prefetch_related("items").get(pk=order_id, user=user)
    except Order.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Buyurtma topilmadi.")

    return _serialize_order(order)


def _serialize_order(order) -> OrderOut:
    items = [
        OrderItemOut(
            id=item.pk,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            size=item.size,
            color=item.color,
            price=item.price,
            total=item.total,
        )
        for item in order.items.all()
    ]
    return OrderOut(
        id=order.pk,
        status=order.status,
        total_amount=order.total_amount,
        full_name=order.full_name,
        address=order.address,
        phone=order.phone,
        note=order.note,
        items=items,
        created_at=order.created_at.isoformat(),
        updated_at=order.updated_at.isoformat(),
    )
