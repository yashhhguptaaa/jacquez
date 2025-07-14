import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userCookie = request.cookies.get('github_user');
  
  if (!userCookie) {
    return NextResponse.json({ user: null });
  }

  try {
    const userData = JSON.parse(userCookie.value);
    return NextResponse.json({ user: userData });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}