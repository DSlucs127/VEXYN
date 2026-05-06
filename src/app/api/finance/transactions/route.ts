import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.financeTransaction.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao carregar transações." }, { status: 500 });
  }
}
