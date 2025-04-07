'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {login} from '@/lib/api/auth'
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import {motion} from 'framer-motion'

const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionFlex = motion(Flex)

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
      const response = await login({username, password})
      console.log(response.data)
      router.push('/dashboard/data')
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const formWidth = useBreakpointValue({base: '90%', md: '400px'})

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg="#000"
      position="relative"
      style={{
        backgroundImage:
          'linear-gradient(to right top, #a4b33a, #82b855, #5fba71, #3bba8d, #14b8a6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
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

        {/* 로그인 카드 */}
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
            로그인
          </Heading>

          <Stack gap={5}>
            <Input
              placeholder="아이디"
              value={username}
              onChange={e => setUsername(e.target.value)}
              color="white"
              bg="transparent"
              _focus={{
                borderColor: 'green.400',
                boxShadow: '0 1px 0 0 green.400'
              }}
            />
            <Input
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              color="white"
              bg="transparent"
            />
            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              colorPalette={'green'}
              variant={'solid'}
              width="full"
              mt={4}>
              로그인
            </Button>
          </Stack>

          <Text color="white" fontSize="sm" mt={6} textAlign="center">
            아직 회원이 아니신가요?{' '}
            <Link
              href="/signup"
              color="green.900"
              textDecoration="underline"
              _hover={{color: 'green.800'}}>
              회원가입
            </Link>
          </Text>
        </MotionBox>
      </MotionFlex>
    </Flex>
  )
}

export default LoginPage
