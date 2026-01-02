import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const body = await req.json();

  const res = await fetch(process.env.APPS_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "client",
      action: "CREATE_REQUEST",
      payload: {
        client_id: userId,
        client_name: user?.fullName,
        ...body,
      },
    }),
  });

  return Response.json(await res.json());
}
