import { auth } from "@lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const setPasswordBodySchema = z.object({
  newPassword: z.string().min(8),
});

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to set password";
}

function getErrorStatus(error: unknown): number {
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 400;
}

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedBody = setPasswordBodySchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Invalid password payload" }, { status: 400 });
  }

  try {
    const result = await auth.api.setPassword({
      headers: request.headers,
      body: {
        newPassword: parsedBody.data.newPassword,
      },
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) }
    );
  }
}
