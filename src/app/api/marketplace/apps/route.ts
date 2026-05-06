import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await prisma.marketplaceApp.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ apps });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao carregar aplicações." }, { status: 500 });
  }
}
