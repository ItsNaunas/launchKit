import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: kit, error } = await supabase
      .from('kits')
      .select('id, title, one_liner, has_access')
      .eq('id', params.id)
      .single();

    if (error || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(kit);
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const { data: kit, error } = await supabase
      .from('kits')
      .update(body)
      .eq('id', params.id)
      .select('id, title, one_liner, has_access')
      .single();

    if (error || !kit) {
      return NextResponse.json(
        { error: 'Kit not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(kit);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}