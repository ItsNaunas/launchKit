import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Deploy website to Netlify or Vercel
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; websiteId: string }> }
) {
  try {
    const { websiteId } = await context.params;
    const { provider } = await request.json();

    // Fetch website
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();

    if (fetchError || !website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }

    if (provider === 'netlify') {
      return await deployToNetlify(website);
    } else if (provider === 'vercel') {
      return await deployToVercel(website);
    } else {
      return NextResponse.json(
        { error: 'Invalid deployment provider' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Failed to deploy website' },
      { status: 500 }
    );
  }
}

async function deployToNetlify(website: any) {
  // Check for Netlify API token
  const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
  
  if (!netlifyToken) {
    return NextResponse.json({
      error: 'Netlify integration not configured. Please set NETLIFY_AUTH_TOKEN in your environment variables.',
      requiresSetup: true,
    }, { status: 400 });
  }

  try {
    // Create a new site on Netlify
    const createSiteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${netlifyToken}`,
      },
      body: JSON.stringify({
        name: `launchkit-${website.kit_id.substring(0, 8)}`,
      }),
    });

    if (!createSiteResponse.ok) {
      throw new Error('Failed to create Netlify site');
    }

    const site = await createSiteResponse.json();

    // Deploy the HTML file
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/zip',
        'Authorization': `Bearer ${netlifyToken}`,
      },
      body: createDeploymentZip(website),
    });

    if (!deployResponse.ok) {
      throw new Error('Failed to deploy to Netlify');
    }

    await deployResponse.json();

    // Update website with deployment info
    await supabase
      .from('websites')
      .update({
        deployed_url: site.url,
        deploy_provider: 'netlify',
        is_published: true,
      })
      .eq('id', website.id);

    return NextResponse.json({
      success: true,
      url: site.url,
      provider: 'netlify',
    });

  } catch (error) {
    console.error('Netlify deployment error:', error);
    return NextResponse.json(
      { error: 'Failed to deploy to Netlify' },
      { status: 500 }
    );
  }
}

async function deployToVercel(_website: any) {
  // Vercel deployment would be similar but using Vercel's API
  // For now, return a message about manual deployment
  
  return NextResponse.json({
    error: 'Vercel deployment not yet implemented. Use the export feature to download HTML and deploy manually.',
    requiresSetup: true,
  }, { status: 400 });
}

function createDeploymentZip(website: any): Blob {
  // This is a simplified version - in production, you'd use a proper zip library
  // For now, we'll just return the HTML as a blob
  return new Blob([website.html_content], { type: 'text/html' });
}

// Export website as a complete package
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

    // Return website package with HTML, CSS, and assets
    const packageData = {
      html: website.html_content,
      css: website.css_content,
      config: website.config,
      metadata: {
        template_id: website.template_id,
        version: website.version,
        created_at: website.created_at,
      },
    };

    return NextResponse.json(packageData);

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export website' },
      { status: 500 }
    );
  }
}

