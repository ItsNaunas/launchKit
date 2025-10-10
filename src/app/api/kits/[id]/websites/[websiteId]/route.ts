import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch a specific website
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; websiteId: string }> }
) {
  try {
    const { websiteId } = await context.params;

    const { data: website, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();

    if (error || !website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ website });

  } catch (error) {
    console.error('Error fetching website:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website' },
      { status: 500 }
    );
  }
}

// PATCH - Update website content
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; websiteId: string }> }
) {
  try {
    const { websiteId } = await context.params;
    const { html, config, css, sections } = await request.json();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (html !== undefined) updateData.html_content = html;
    if (config !== undefined) updateData.config = config;
    if (css !== undefined) updateData.css_content = css;
    if (sections !== undefined) updateData.sections = sections;

    const { data: website, error } = await supabase
      .from('websites')
      .update(updateData)
      .eq('id', websiteId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      website 
    });

  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { error: 'Failed to update website' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a website
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; websiteId: string }> }
) {
  try {
    const { websiteId } = await context.params;

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json(
      { error: 'Failed to delete website' },
      { status: 500 }
    );
  }
}

