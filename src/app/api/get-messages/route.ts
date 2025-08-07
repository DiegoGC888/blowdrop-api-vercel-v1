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
        // Obtener IP desde header
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { refresh_token, email } = await req.json();  
    if (!refresh_token || !email) {
      return new NextResponse(
        JSON.stringify({ error: "refresh_token and email are required" }),
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }
    
console.log("SUPABASE:", process.env.SUPABASE_ANON_KEY);

    const response = await fetch("https://cjsxbayumsbpvezswsfs.supabase.co/functions/v1/get-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Solo el backend conoce esta key, segura
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({ refresh_token, email }),
    });
console.log("termino consumo de api");
    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // fallback para errores HTML o text/plain
    }

    return new NextResponse(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": contentType.includes("application/json")
            ? "application/json"
            : "text/plain",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en proxy reset-pwd:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error", detail: `${error}` }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}