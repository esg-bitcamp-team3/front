"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkUsername, checkEmail } from "@/lib/api/auth"; // checkEmail 추가
import { toaster } from "@/components/ui/toaster";
import { ApiError } from "next/dist/server/api-utils";
import {
  Box,
  Button,
  Flex,
  FieldLabel,
  Fieldset,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  Field,
} from "@chakra-ui/react";

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
      toaster.success({
        title: response.data,
      });
      router.push("/dashboard");
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
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      bg="#f7f7f7"
      p={5}
    >
      <Box
        w="100%"
        maxW="600px"
        bg="white"
        p={8}
        borderRadius="8px"
        boxShadow="lg"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          회원가입
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            {/* 첫 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="이메일을 입력하세요"
                />
                {emailError && <Text color="red.500">{emailError}</Text>}
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="name">이름</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </Field.Root>
            </Flex>

            {/* 두 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="username">아이디</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="아이디를 입력하세요"
                />
                {usernameError && <Text color="red.500">{usernameError}</Text>}
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="organization">조직명</FieldLabel>
                <Input
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="조직명을 입력하세요"
                />
              </Field.Root>
            </Flex>

            {/* 세 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="confirmPassword">비밀번호 확인</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 확인하세요"
                />
              </Field.Root>
            </Flex>

            {/* 오류 메시지 */}
            {error && <Text color="red.500">{error}</Text>}

            {/* 회원가입 버튼 */}
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              회원가입
            </Button>
          </Stack>
        </form>

        {/* 로그인 페이지 링크 */}
        <Box mt={4}>
          <Text fontSize="sm" color="gray.600">
            이미 회원이신가요?{" "}
            <a
              href="/login"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              로그인
            </a>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignUpPage;
