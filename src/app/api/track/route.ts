import { NextRequest, NextResponse } from 'next/server';
import { encryptPayload } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.deezer.com/track/${id}`);
    
    if (!res.ok) {
      throw new Error(`Deezer API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return new NextResponse(encryptPayload(data), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('API Track Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
