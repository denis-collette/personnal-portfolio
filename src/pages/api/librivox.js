export const prerender = false;

export async function POST({ request }) {
  try {
    const params = await request.json();
    console.log('[API PROXY - POST] Received params:', params);

    if (params.rss_url) {
      const rssResponse = await fetch(params.rss_url);
      if (!rssResponse.ok) throw new Error(`RSS fetch failed`);
      const rssText = await rssResponse.text();
      const match = rssText.match(/<itunes:image href="([^"]+)"/);
      return new Response(JSON.stringify({ imageUrl: match ? match[1] : null }));
    }

    let librivoxApiUrl = new URL('https://librivox.org/api/feed/audiobooks/');
    for (const key in params) {
      if (params[key] !== undefined) {
        librivoxApiUrl.searchParams.append(key, params[key]);
      }
    }
    librivoxApiUrl.searchParams.set('format', 'json');

    const librivoxResponse = await fetch(librivoxApiUrl.toString());
    if (!librivoxResponse.ok) throw new Error(`LibriVox API fetch failed`);

    const data = await librivoxResponse.json();
    return new Response(JSON.stringify(data));

  } catch (error) {
    console.error(`[API PROXY - POST] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET({ request, url }) {
  const audioUrl = url.searchParams.get('url');
  console.log(`[API PROXY - GET] Handling Audio stream for: ${audioUrl}`);

  if (!audioUrl) {
    return new Response(JSON.stringify({ error: 'Missing audio URL' }), { status: 400 });
  }

  try {
    const range = request.headers.get('range');

    const audioResponse = await fetch(audioUrl, {
      headers: {
        ...(range && { Range: range }),
      },
    });

    if (!audioResponse.ok) throw new Error(`Audio fetch failed with status ${audioResponse.status}`);

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    responseHeaders.set('Content-Length', audioResponse.headers.get('Content-Length'));
    responseHeaders.set('Accept-Ranges', audioResponse.headers.get('Accept-Ranges') || 'bytes');
    if (audioResponse.headers.has('Content-Range')) {
      responseHeaders.set('Content-Range', audioResponse.headers.get('Content-Range'));
    }

    return new Response(audioResponse.body, {
      status: audioResponse.status,
      statusText: audioResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error(`[API PROXY - GET] Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}