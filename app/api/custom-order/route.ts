import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, product_name, description, additional } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !product_name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically save the order to your database
    // For now, we'll just return a success response
    return NextResponse.json(
      { 
        message: 'Custom order request received successfully',
        order: {
          name,
          email,
          phone,
          address,
          product_name,
          description,
          additional
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing custom order:', error);
    return NextResponse.json(
      { error: 'Failed to process custom order request' },
      { status: 500 }
    );
  }
} 