import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get count of kits created today
    const { count, error } = await supabase
      .from('kits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.error('Error fetching daily count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch daily count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      count: count || 0,
      limit: 50,
      remaining: Math.max(0, 50 - (count || 0))
    });

  } catch (error) {
    console.error('Daily count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
