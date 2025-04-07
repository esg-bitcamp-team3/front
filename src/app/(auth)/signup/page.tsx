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
  Link,
  Image,
  Heading
} from '@chakra-ui/react'
import {motion} from 'framer-motion'

const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionFlex = motion(Flex)

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('') // 이메일 추가
  const [name, setName] = useState('') // 이름 추가
  const [organization, setOrganization] = useState('') // 조직명 추가
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
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

  const formWidth = useBreakpointValue({base: '90%', md: '600px'})

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
      <MotionFlex
        zIndex={1}
        direction="column"
        align="center"
        justify="center"
        gap={10}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 1}}
        px={4}>
        {/* 로고 + 타이틀 */}
        <MotionBox
          display="flex"
          alignItems="center"
          justifyContent={'center'}
          gap={4}
          as={motion.div}
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.5}}>
          <Image
            src="/project_logo.png"
            alt="Green Gauge Logo"
            width="40%"
            height="auto"
            paddingTop={2}
          />
        </MotionBox>

        {/* 회원가입 폼 */}
        <MotionBox
          width={formWidth}
          bg="rgba(255, 255, 255, 0.08)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255,255,255,0.15)"
          borderRadius="xl"
          boxShadow="xl"
          p={8}
          as="form"
          onSubmit={handleSubmit}
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.6}}>
          <Heading color="white" size="md" mb={6} textAlign="center">
            회원가입
          </Heading>

          <Stack gap={4}>
            {/* 첫 번째 줄 */}
            <Flex justify="space-between" gap={4}>
              <Field.Root w="48%">
                <Field.Label htmlFor="email" color="white">
                  이메일
                </Field.Label>
                <Input
                  color="white"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </Field.Root>

              <Field.Root w="48%">
                <Field.Label htmlFor="name" color="white">
                  이름
                </Field.Label>
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
                <Field.Label htmlFor="username" color="white">
                  아이디
                </Field.Label>
                <Input
                  color="white"
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요"
                />
              </Field.Root>

              <Field.Root w="48%">
                <Field.Label htmlFor="organization" color="white">
                  조직명
                </Field.Label>
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
                <Field.Label htmlFor="password" color="white">
                  비밀번호
                </Field.Label>
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
                <Field.Label htmlFor="confirmPassword" color="white">
                  비밀번호 확인
                </Field.Label>
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
              colorPalette={'green'}
              variant={'solid'}
              width="full"
              mt={4}>
              회원가입
            </Button>
          </Stack>
          {/* 로그인 페이지 링크 */}
          <Text color="white" fontSize="sm" mt={6} textAlign="center">
            이미 회원이신가요?{' '}
            <Link
              href="/login"
              color="green.900"
              textDecoration="underline"
              _hover={{color: 'green.800'}}>
              로그인
            </Link>
          </Text>
        </MotionBox>
      </MotionFlex>
    </Flex>
  )
}

export default SignUpPage
