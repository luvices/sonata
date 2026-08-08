import { NextRequest, NextResponse } from 'next/server';
import { encryptPayload } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '20';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Adding order=RANKING ensures the most popular/relevant songs (not audiobooks) come first
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}&order=RANKING`);
    
    if (!res.ok) {
      throw new Error(`Deezer API responded with status: ${res.status}`);
    }

    // Filter out audiobooks, chapters, remixes, sped up versions, covers, etc.
    if (data && data.data) {
      const bannedWords = ['chapter ', 'remix', 'sped up', 'slowed', 'instrumental', 'karaoke', 'cover', 'live at', '(live)', 'live version'];
      
      data.data = data.data.filter((track: any) => {
        const title = track.title.toLowerCase();
        const artist = track.artist.name.toLowerCase();
        
        return !bannedWords.some(word => title.includes(word) || artist.includes(word));
      });
    }

    return new NextResponse(encryptPayload(data), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('API Search Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
