import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // @ts-expect-error: accessToken is added to session in NextAuth callback
  const accessToken = session.accessToken || session.user.accessToken;
  if (!accessToken) {
    return NextResponse.json({ error: "No GitHub access token found" }, { status: 403 });
  }

  const username = session.user.name;
  if (!username) {
    return NextResponse.json({ error: "No GitHub username found" }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
