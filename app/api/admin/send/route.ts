import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const res = await fetch(process.env.APPS_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "admin",
      action: "SEND_TO_SUPPLIER",
      payload: body,
    }),
  });

  return Response.json(await res.json());
}
