import { NextResponse } from 'next/server';
import { getAllPersonas, getPersonaByCategory } from '@/lib/persona-templates';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let personas;
    if (category) {
      personas = getPersonaByCategory(category);
    } else {
      personas = getAllPersonas();
    }

    return NextResponse.json({ personas });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
