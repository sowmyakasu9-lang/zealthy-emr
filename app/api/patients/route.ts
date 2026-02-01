import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
    return NextResponse.json(patients);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
      },
    });

    return new Response(JSON.stringify(patient), { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "Email already exists" }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to create patient" }),
      { status: 500 }
    );
  }
}
