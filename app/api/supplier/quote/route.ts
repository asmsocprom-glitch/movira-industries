import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.role !== "supplier")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const res = await fetch(process.env.APPS_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "supplier",
      action: "SUBMIT_QUOTE",
      payload: { supplier_id: userId, ...body },
    }),
  });

  return Response.json(await res.json());
}
