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
    const { refresh_token, email } = await req.json();  
console.log("SUPABASE:", process.env.SUPABASE_ANON_KEY);

    const response = await fetch("https://cjsxbayumsbpvezswsfs.supabase.co/functions/v1/request-pwd-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Solo el backend conoce esta key, segura
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ refresh_token, email }),
    });
console.log("termino consumo de api");
    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error || "Error interno del servidor." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
