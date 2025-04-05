'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {signup, checkUsername, checkEmail} from '@/lib/api/auth' // checkEmail 추가
import {toaster} from '@/components/ui/toaster'
import {ApiError} from 'next/dist/server/api-utils'
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
  Link
} from '@chakra-ui/react'

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('') // 이메일 추가
  const [name, setName] = useState('') // 이름 추가
  const [organization, setOrganization] = useState('') // 조직명 추가
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('') // 아이디 중복 오류 메시지
  const [emailError, setEmailError] = useState('') // 이메일 중복 오류 메시지
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !name || !organization || !password || !confirmPassword) {
      setError('모든 필드를 채워주세요.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await signup({
        email: email,
        name: name,
        username: username,
        password: password,
        organization: organization
      })
      toaster.success({
        title: '회원 가입 성공!'
      })
      router.push('/dashboard/data')
    } catch (error) {
      toaster.error({
        title:
          error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다.'
      })
    }
  }

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    // 아이디 중복 확인
    if (value) {
      const isUsernameTaken = await checkUsername(value)
      if (isUsernameTaken) {
        setUsernameError('중복된 아이디입니다.')
      } else {
        setUsernameError('')
      }
    }
  }

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // 이메일 중복 확인
    if (value) {
      const isEmailTaken = await checkEmail(value)
      if (isEmailTaken) {
        setEmailError('중복된 이메일입니다.')
      } else {
        setEmailError('')
      }
    }
  }

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      p={5}
      style={{
        backgroundImage:
          'linear-gradient(to right top, #a4b33a, #82b855, #5fba71, #3bba8d, #14b8a6)',
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
          <Text color="white">Welcome to Green Gauge</Text>
        </Box>
      </Text>

      {/* 회원가입 폼 */}
      <Box
        w="100%"
        maxW="600px"
        bg="rgba(0, 0, 0, 0.5)" // 투명한 배경색 (흰색 배경에 80% 투명도)
        p={8}
        borderRadius="8px"
        boxShadow="lg"
        textAlign="center">
        <Text fontSize="2xl" color="white" fontWeight="bold" mb={6}>
          회원가입
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            {/* 첫 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="email" color="white">
                  이메일
                </FieldLabel>
                <Input
                  color="white"
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="이메일을 입력하세요"
                />
                {emailError && <Text color="red.500">{emailError}</Text>}
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="name" color="white">
                  이름
                </FieldLabel>
                <Input
                  color="white"
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </Field.Root>
            </Flex>

            {/* 두 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="username" color="white">
                  아이디
                </FieldLabel>
                <Input
                  color="white"
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="아이디를 입력하세요"
                />
                {usernameError && <Text color="red.500">{usernameError}</Text>}
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="organization" color="white">
                  조직명
                </FieldLabel>
                <Input
                  color="white"
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="조직명을 입력하세요"
                />
              </Field.Root>
            </Flex>

            {/* 세 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <FieldLabel htmlFor="password" color="white">
                  비밀번호
                </FieldLabel>
                <Input
                  color="white"
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </Field.Root>

              <Field.Root w="48%">
                <FieldLabel htmlFor="confirmPassword" color="white">
                  비밀번호 확인
                </FieldLabel>
                <Input
                  color="white"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 확인하세요"
                />
              </Field.Root>
            </Flex>

            {/* 오류 메시지 */}
            {error && <Text color="red.500">{error}</Text>}

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              bg="green.500"
              _hover={{bg: 'green.400'}}
              colorScheme="blue"
              width="full"
              mt={4}>
              회원가입
            </Button>
          </Stack>
        </form>

        {/* 로그인 페이지 링크 */}
        <Box mt={4}>
          <Text fontSize="sm" color="white">
            이미 회원이신가요?{' '}
            <a href="/login" style={{color: 'white', textDecoration: 'none'}}>
              로그인
            </a>
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default SignUpPage
