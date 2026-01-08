import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const reqPayload = await request.json();

  try {
    const res : any = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( reqPayload ),
  });
    const { status, data, message } = res || {};

    const response = NextResponse.json({ status, message });
    response.cookies.set('token', data?.token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ status: 200, message: 'testing failed' });
  }
}
