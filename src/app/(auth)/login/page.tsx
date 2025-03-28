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
  Link,
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
      p={5}
      style={{
        backgroundImage: 'url("/bg.jpg")', // 배경 이미지 설정
        backgroundSize: 'cover', // 배경 이미지가 화면 크기에 맞게 크기 조정
        backgroundPosition: 'center', // 배경 이미지가 화면 중앙에 위치하도록 설정
        backgroundRepeat: 'no-repeat' // 배경 이미지 반복 방지
      }}>
      {/* 상단 타이틀과 로고 */}
      <Text
        className="lusitana" // Assuming you have the 'lusitana' class from your previous setup
        fontSize={{base: 'xl', md: '3xl'}}
        color="green.600"
        lineHeight={{md: 'normal'}}
        mb={250}
        textAlign="center"
        style={{marginTop: '0'}} // 상단에 완전히 붙이기 위해 marginTop을 0으로 설정
      >
        <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
          <Link href="/">
            <Button as="a" bg="rgba(0, 0, 0, 0.0)" color="white" padding={4}>
              <img
                src="/gglogo.png"
                alt="Green Gauge Logo"
                style={{width: '50px', height: '50px'}}
              />
            </Button>
          </Link>
          <strong>Welcome to Green Gauge</strong>
        </Box>
      </Text>
      <Box
        w="100%"
        maxW="400px"
        bg="rgba(0, 0, 0, 0.5)" // 투명한 배경색 (흰색 배경에 80% 투명도)
        p={8}
        borderRadius="8px"
        boxShadow="lg"
        textAlign="center">
        <Heading as="h2" color="white" size="lg" mb={6}>
          로그인
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Field.Root>
              <FieldLabel htmlFor="username">아이디</FieldLabel>
              <Input
                color="white"
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
                color="white"
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
            <Button
              type="submit"
              bg="green.500"
              _hover={{bg: 'green.400'}}
              colorScheme="blue"
              width="full"
              mt={4}>
              로그인
            </Button>
          </Stack>
        </form>
        <Box mt={4}>
          <Text fontSize="sm" color="white">
            아직 회원이 아니신가요?{' '}
            <a href="/signup" style={{color: 'white', textDecoration: 'none'}}>
              회원가입
            </a>
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default LoginPage
