import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear authentication cookies
  response.cookies.delete('github_access_token');
  response.cookies.delete('github_user');
  
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear authentication cookies
  response.cookies.delete('github_access_token');
  response.cookies.delete('github_user');
  
  return response;
}