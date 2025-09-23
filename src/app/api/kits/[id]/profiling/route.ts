import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { selectedOptions, profilingData } = body;

    // Update the kit with profiling data
    const { error } = await supabase
      .from('kits')
      .update({
        selected_options: JSON.stringify(selectedOptions),
        profiling_data: JSON.stringify(profilingData),
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating kit with profiling data:', error);
      return NextResponse.json(
        { error: 'Failed to save profiling data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
