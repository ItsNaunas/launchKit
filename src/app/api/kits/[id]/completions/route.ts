import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// GET /api/kits/[id]/completions - Fetch completion status for all tabs
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: kitId } = await context.params;

    // Fetch completion status for this kit
    const { data: completions, error } = await supabase
      .from('tab_completions')
      .select('*')
      .eq('kit_id', kitId);

    if (error) {
      console.error('Error fetching completions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch completions' },
        { status: 500 }
      );
    }

    // Transform to an object for easier use
    const completionsMap = {
      business_case: false,
      content_strategy: false,
      website: false,
    };

    const completionsArray = (completions || []) as any[];
    completionsArray.forEach((completion) => {
      if (completion.tab_key && completion.tab_key in completionsMap) {
        completionsMap[completion.tab_key as keyof typeof completionsMap] = completion.is_complete;
      }
    });

    return NextResponse.json({ completions: completionsMap });
  } catch (error) {
    console.error('Error in completions GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/kits/[id]/completions - Mark a tab as complete
const MarkCompleteSchema = z.object({
  tabKey: z.enum(['business_case', 'content_strategy', 'website']),
  isComplete: z.boolean(),
  outputId: z.string().uuid().optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: kitId } = await context.params;
    const body = await request.json();
    const { tabKey, isComplete, outputId } = MarkCompleteSchema.parse(body);

    // Check if completion record exists
    const { data: existing } = await supabase
      .from('tab_completions')
      .select('*')
      .eq('kit_id', kitId)
      .eq('tab_key', tabKey)
      .single();

    if (existing) {
      // Update existing record
      const { error } = await (supabase
        .from('tab_completions') as any)
        .update({
          is_complete: isComplete,
          chosen_output_id: outputId || null,
          completed_at: isComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('kit_id', kitId)
        .eq('tab_key', tabKey);

      if (error) {
        console.error('Error updating completion:', error);
        return NextResponse.json(
          { error: 'Failed to update completion' },
          { status: 500 }
        );
      }
    } else {
      // Create new record
      const { error } = await (supabase
        .from('tab_completions') as any)
        .insert({
          kit_id: kitId,
          tab_key: tabKey,
          is_complete: isComplete,
          chosen_output_id: outputId || null,
          completed_at: isComplete ? new Date().toISOString() : null,
        });

      if (error) {
        console.error('Error creating completion:', error);
        return NextResponse.json(
          { error: 'Failed to create completion' },
          { status: 500 }
        );
      }
    }

    // Fetch updated completions
    const { data: completions } = await supabase
      .from('tab_completions')
      .select('*')
      .eq('kit_id', kitId);

    const completionsMap = {
      business_case: false,
      content_strategy: false,
      website: false,
    };

    const updatedCompletionsArray = (completions || []) as any[];
    updatedCompletionsArray.forEach((completion) => {
      if (completion.tab_key && completion.tab_key in completionsMap) {
        completionsMap[completion.tab_key as keyof typeof completionsMap] = completion.is_complete;
      }
    });

    return NextResponse.json({ 
      success: true,
      completions: completionsMap,
    });
  } catch (error) {
    console.error('Error in completions POST:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

