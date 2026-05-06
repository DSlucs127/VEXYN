import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar sessão." }, { status: 500 });
  }
}
