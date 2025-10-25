import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderStatusUpdate } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const order = await Order.findById(params.id).populate('items.productId');
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Get the current order to check if status is changing
    const currentOrder = await Order.findById(params.id);
    const isStatusChange = body.status && currentOrder && body.status !== currentOrder.status;
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('items.productId');
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Send status update notification if status changed
    if (isStatusChange) {
      try {
        await sendOrderStatusUpdate(order, body.status);
      } catch (notificationError) {
        console.error('Failed to send status update notifications:', notificationError);
        // Don't fail the update if notifications fail
      }
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}