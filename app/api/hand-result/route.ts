import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Hand result received.",
    receivedAt: Date.now(),
  });
}
