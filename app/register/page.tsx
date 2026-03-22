"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterErrors } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ← 追加
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const getLogin = async () => {
    router.push("/login");
  };

  const handleRegister = async () => {
    setRegisterErrors({}); // ← 全エラーリセット
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, confirmPassword }),
      });

      if (!res.ok) {
        const data = await res.json();

        setRegisterErrors(
          data.registerErrors || { general: "登録に失敗しました" },
        );

        setLoading(false);
        return;
      }

      // 自動ログイン
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setRegisterErrors({
          general: "自動ログインに失敗しました。手動でログインしてください",
        });
      } else {
        router.push("/dashboard");
      }
    } catch {
      setRegisterErrors({
        general: "サーバーエラーが発生しました",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <div>
        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {registerErrors.name && (
          <p style={{ color: "red" }}>{registerErrors.name}</p>
        )}
      </div>

      <div>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {registerErrors.email && (
          <p style={{ color: "red" }}>{registerErrors.email}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {registerErrors.password && (
          <p style={{ color: "red" }}>{registerErrors.password}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {registerErrors.confirmPassword && (
          <p style={{ color: "red" }}>{registerErrors.confirmPassword}</p>
        )}
      </div>

      {registerErrors.general && (
        <p style={{ color: "red" }}>{registerErrors.general}</p>
      )}

      <div>
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "登録中..." : "Register"}
        </button>
      </div>
      <div>
        <button onClick={getLogin}>Login</button>
      </div>
    </div>
  );
}
