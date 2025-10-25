import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { deleteImageByUrl } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const existingProduct = await Product.findById(params.id);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const oldImages = existingProduct.images || [];
    const newImages = body.images || [];

    const imagesToDelete = oldImages.filter((oldImg: string) => !newImages.includes(oldImg));

    for (const imageUrl of imagesToDelete) {
      try {
        await deleteImageByUrl(imageUrl);
      } catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
      }
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const images = product.images || [];
    for (const imageUrl of images) {
      try {
        await deleteImageByUrl(imageUrl);
      } catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
      }
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
