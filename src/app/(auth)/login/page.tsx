// src/app/auth/login/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { getMyOrganizations } from "@/lib/api/my";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      const response = await login({ username: username, password: password });
      console.log(response.data);
      router.push("/dashboard");
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>로그인</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              style={styles.input}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>
            로그인
          </button>
        </form>
        <div style={styles.signupLinkContainer}>
          <p style={styles.signupLinkText}>
            아직 회원이 아니신가요?{" "}
            <a href="/signup" style={styles.signupLink}>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    padding: "30px 40px",
    borderRadius: "8px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
  },
  header: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    color: "#333",
    outline: "none",
    transition: "border-color 0.3s ease-in-out",
  },
  button: {
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "10px",
  },
  signupLinkContainer: {
    marginTop: "20px",
  },
  signupLinkText: {
    fontSize: "14px",
    color: "#555",
  },
  signupLink: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default LoginPage;
