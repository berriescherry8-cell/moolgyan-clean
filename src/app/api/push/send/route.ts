import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Send push notification endpoint' });
}

