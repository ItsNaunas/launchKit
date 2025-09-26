import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { data: kit, error } = await supabaseAdmin
      .from('kits')
      .select('id, title, one_liner, has_access')
      .eq('id', resolvedParams.id)
      .single();

    if (error || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    // Type assertion for proper JSON response
    const kitData = kit as any;
    return NextResponse.json(kitData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    
    const { data: kit, error } = await supabaseAdmin
      .from('kits')
      .update(body as never)
      .eq('id', resolvedParams.id)
      .select('id, title, one_liner, has_access')
      .single();

    if (error || !kit) {
      return NextResponse.json(
        { error: 'Kit not found or update failed' },
        { status: 404 }
      );
    }

    // Type assertion for proper JSON response
    const kitData = kit as any;
    return NextResponse.json(kitData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}