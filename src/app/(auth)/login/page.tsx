// src/app/auth/login/page.tsx

'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {login} from '@/lib/api/auth'
import {getMyOrganizations} from '@/lib/api/my'
import {
  Box,
  Button,
  Field,
  FieldLabel,
  Fieldset,
  Flex,
  Heading,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }
    try {
      const response = await login({username: username, password: password})
      console.log(response.data)
      router.push('/dashboard')
    } catch (error) {
      console.log('error')
    }
  }

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      bg="#f7f7f7"
      p={5}>
      <Box
        w="100%"
        maxW="400px"
        bg="white"
        p={8}
        borderRadius="8px"
        boxShadow="lg"
        textAlign="center">
        <Heading as="h2" size="lg" mb={6}>
          로그인
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Field.Root>
              <FieldLabel htmlFor="username">아이디</FieldLabel>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
              />
            </Field.Root>
            <Field.Root>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </Field.Root>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              로그인
            </Button>
          </Stack>
        </form>
        <Box mt={4}>
          <Text fontSize="sm" color="gray.600">
            아직 회원이 아니신가요?{' '}
            <a href="/signup" style={{color: '#007bff', textDecoration: 'none'}}>
              회원가입
            </a>
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default LoginPage
