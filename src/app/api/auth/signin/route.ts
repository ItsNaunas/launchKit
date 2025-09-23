import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For now, just return success - we'll implement proper auth later
    return NextResponse.json({
      user: {
        id: 'temp-user-' + Date.now(),
        email: email,
      },
      message: 'Signed in successfully!',
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
