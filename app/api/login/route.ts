import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // fetch で next-auth の認証エンドポイントを叩く
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: "", // CSRFトークンが必要な場合は取得してセット
        email,
        password,
      }),
    },
  );

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "メールアドレスまたはパスワードが間違っています" },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
