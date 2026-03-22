"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // ログインしていなければリダイレクト
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>; // 認証確認中

  return (
    <div>
      <h1>Dashboard</h1>
      <p>ようこそ、{session?.user?.email}さん！</p>
      <LogoutButton />
    </div>
  );
}
