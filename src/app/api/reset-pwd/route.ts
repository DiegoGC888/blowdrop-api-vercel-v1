// app/api/reset-pwd/route.ts
export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Entro 1");

  try {
    const { email, newPassword, token } = await req.json();
console.log("SUPABASE:", process.env.SUPABASE_ANON_KEY);

    const response = await fetch("https://cjsxbayumsbpvezswsfs.supabase.co/functions/v1/reset-pwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Solo el backend conoce esta key, segura
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, newPassword, token }),
    });
console.log("termino consumo de api");
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
