"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginErrors } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const getRegister = () => {
    router.push("/register");
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    const newErrors: LoginErrors = {};

    if (!email) newErrors.email = "メールアドレスを入力してください";
    else if (!email.includes("@"))
      newErrors.email = "正しいメールアドレスを入力してください";

    if (!password) newErrors.password = "パスワードを入力してください";

    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      setLoading(false);
      return;
    }

    setLoginErrors({});

    const res = await signIn("credentials", {
      redirect: false, // 自動でリダイレクトさせない
      email,
      password,
    });

    if (res?.error) {
      setLoginErrors({
        general: "メールアドレスまたはパスワードが間違っています",
      });
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Login</h1>

      {/* email */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLoginErrors((prev) => ({
              ...prev,
              email: undefined,
              general: undefined,
            }));
          }}
        />
        {loginErrors.email && (
          <p style={{ color: "red", margin: 0 }}>{loginErrors.email}</p>
        )}
      </div>

      {/* password */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginErrors((prev) => ({
              ...prev,
              password: undefined,
              general: undefined,
            }));
          }}
        />
        {loginErrors.password && (
          <p style={{ color: "red", margin: 0 }}>{loginErrors.password}</p>
        )}
      </div>

      {/* 共通エラー */}
      {loginErrors.general && (
        <p style={{ color: "red" }}>{loginErrors.general}</p>
      )}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "ログイン中..." : "Login"}
      </button>

      <button onClick={getRegister}>Register</button>
    </div>
  );
}
