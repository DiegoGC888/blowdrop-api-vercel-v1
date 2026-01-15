// app/api/reset-pwd/route.ts
export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ⚠️ En producción, cambia por tu dominio
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
 
// Maneja el preflight (CORS OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
    console.log("Entro 1");

  try {
    const { email, newPassword, access_token, refresh_token } = await req.json();
    const supabaseKey = (process.env.SUPABASE_ANON_KEY ?? "").trim();
    console.log("SUPABASE:", supabaseKey); 
    console.log("email:", email);
    console.log("access_token:", access_token);
    console.log("refresh_token:", refresh_token);

    const response = await fetch("https://kjaubxdhydpavobfbbkk.supabase.co/functions/v1/reset-pwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Solo el backend conoce esta key, segura
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ email, newPassword, access_token, refresh_token }),
    });
    console.log("termino consumo de api");
    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Error interno del servidor." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
