import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { RegisterErrors } from "@/types/auth";

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json();
  const registerErrors: RegisterErrors = {};
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!name) {
    registerErrors.name = "ユーザー名を入力してください";
  }

  if (!email || !email.includes("@")) {
    registerErrors.email = "正しいメールアドレスを入力してください";
  }

  if (!password || password.length < 8) {
    registerErrors.password = "パスワードは8文字以上で入力してください";
  }

  if (password !== confirmPassword) {
    registerErrors.confirmPassword = "パスワードが一致しません";
  }

  if (existing) {
    registerErrors.email = "ユーザーはすでに存在します";
  }

  // エラーが1つでもあればまとめて返す
  if (Object.keys(registerErrors).length > 0) {
    return new Response(JSON.stringify({ registerErrors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hashed = hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  return Response.json({ id: user.id, email: user.email, name: user.name });
}
