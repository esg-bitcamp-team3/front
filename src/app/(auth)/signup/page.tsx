"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkUsername, checkEmail } from "@/lib/api/auth"; // checkEmail 추가
import { toaster } from "@/components/ui/toaster";
import { ApiError } from "next/dist/server/api-utils";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 이메일 추가
  const [name, setName] = useState(""); // 이름 추가
  const [organization, setOrganization] = useState(""); // 조직명 추가
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(""); // 아이디 중복 오류 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 중복 오류 메시지
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !username ||
      !email ||
      !name ||
      !organization ||
      !password ||
      !confirmPassword
    ) {
      setError("모든 필드를 채워주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await signup({
        email: email,
        name: name,
        username: username,
        password: password,
        organization: organization,
      });

      if (response.ok) {
        router.push("/login");
        toaster.success({
          title: "회원가입입 성공",
        });
      }
      toaster.error({
        title: "회원가입입 실패",
      });
    } catch (error) {
      toaster.error({
        title:
          error instanceof ApiError
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  const handleUsernameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setUsername(value);

    // 아이디 중복 확인
    if (value) {
      const isUsernameTaken = await checkUsername(value);
      if (isUsernameTaken) {
        setUsernameError("중복된 아이디입니다.");
      } else {
        setUsernameError("");
      }
    }
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // 이메일 중복 확인
    if (value) {
      const isEmailTaken = await checkEmail(value);
      if (isEmailTaken) {
        setEmailError("중복된 이메일입니다.");
      } else {
        setEmailError("");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>회원가입</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputRow}>
            <div style={styles.inputContainer}>
              <label style={styles.label}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange} // 이메일 중복 체크
                placeholder="이메일을 입력하세요"
                style={styles.input}
              />
              {emailError && <div style={styles.error}>{emailError}</div>}
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.label}>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputContainer}>
              <label style={styles.label}>아이디</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange} // 아이디 변경 시 중복 체크
                placeholder="아이디를 입력하세요"
                style={styles.input}
              />
              {usernameError && <div style={styles.error}>{usernameError}</div>}
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.label}>조직명</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="조직명을 입력하세요"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputRow}>
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

            <div style={styles.inputContainer}>
              <label style={styles.label}>비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 확인하세요"
                style={styles.input}
              />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>
            회원가입
          </button>
        </form>
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
    maxWidth: "600px",
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
    flexDirection: "column" as "column",
    gap: "20px",
  },
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    width: "48%", // Each input container takes 48% of the row
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
};

export default SignUpPage;
