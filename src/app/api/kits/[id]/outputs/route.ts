import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { kitIdSchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id: kitId } = kitIdSchema.parse(resolvedParams);

    // Get kit to verify access
    const { data: kit, error: kitError } = await supabaseAdmin
      .from('kits')
      .select('has_access')
      .eq('id', kitId)
      .single();

    if (kitError || !kit) {
      return NextResponse.json(
        { error: 'Kit not found' },
        { status: 404 }
      );
    }

    // Type assertion for kit after null check
    const kitData = kit as any;

    if (!kitData.has_access) {
      return NextResponse.json(
        { error: 'Access denied. Please complete payment to view content.' },
        { status: 403 }
      );
    }

    // Get all outputs for this kit
    const { data: outputs, error: outputsError } = await supabaseAdmin
      .from('outputs')
      .select('*')
      .eq('kit_id', kitId)
      .order('created_at', { ascending: false });

    if (outputsError) {
      console.error('Failed to fetch outputs:', outputsError);
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      );
    }

    // Transform outputs for easier frontend consumption
    const transformedOutputs = (outputs as any[]).reduce((acc, output) => {
      console.log('Raw output from DB:', output); // Debug log
      const parsedContent = JSON.parse(output.content);
      console.log('Parsed content:', parsedContent); // Debug log
      
      acc[output.type] = {
        id: output.id,
        content: parsedContent,
        regen_count: output.regen_count,
        regens_remaining: 3 - output.regen_count,
        created_at: output.created_at,
        updated_at: output.updated_at,
      };
      return acc;
    }, {} as Record<string, {
      id: string;
      content: unknown;
      regen_count: number;
      regens_remaining: number;
      created_at: string;
      updated_at: string;
    }>);

    console.log('Transformed outputs:', transformedOutputs); // Debug log

    return NextResponse.json(transformedOutputs);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
