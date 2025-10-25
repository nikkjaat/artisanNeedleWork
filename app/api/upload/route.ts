import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, uploadFromUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadType = formData.get('uploadType') as string;

    if (uploadType === 'url') {
      const imageUrl = formData.get('imageUrl') as string;

      if (!imageUrl) {
        return NextResponse.json(
          { success: false, error: 'Image URL is required' },
          { status: 400 }
        );
      }

      const cloudinaryUrl = await uploadFromUrl(imageUrl);

      return NextResponse.json({
        success: true,
        url: cloudinaryUrl,
      });
    } else if (uploadType === 'file') {
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'File is required' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

      const cloudinaryUrl = await uploadToCloudinary(base64File);

      return NextResponse.json({
        success: true,
        url: cloudinaryUrl,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid upload type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
