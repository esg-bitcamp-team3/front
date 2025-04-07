'use client'

import Link from 'next/link'
import {lusitana} from '@/app/ui/fonts'
import {Box, Text, Button, Stack, Flex, Heading, Image} from '@chakra-ui/react'
import {motion} from 'framer-motion'

const MotionBox = motion(Box)
import {LuArrowRight} from 'react-icons/lu'

export default function Page() {
  return (
    <Box
      flexDirection="column"
      style={{
        backgroundImage:
          'linear-gradient(to right top, #a4b33a, #82b855, #5fba71, #3bba8d, #14b8a6)',
        backgroundSize: 'cover', // 배경이 화면 크기에 맞게 크기 조정
        backgroundPosition: 'center', // 배경이 화면 중앙에 위치하도록 설정
        backgroundRepeat: 'no-repeat' // 배경 반복 방지
      }}>
      {/* 상단 타이틀과 로고 */}
      <Box
        className={lusitana.className}
        fontSize={{base: 'xl', md: '3xl'}}
        color="white"
        lineHeight={{md: 'normal'}}
        mb={6}
        textAlign="center">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={4}
          paddingTop={7}>
          {' '}
          <Link href="/">
            <Button as="a" bg="rgba(0, 0, 0, 0.0)" color="white" padding={4}>
              <img
                src="/project_logo.png"
                alt="Green Gauge Logo"
                style={{width: '50px', height: '50px'}}
              />
            </Button>
          </Link>
        </Box>
      </Box>

      {/* 환경 관련 메시지, 로그인 버튼을 중앙에 배치 */}
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center" // 콘텐츠를 수직 중앙 정렬
        // 버튼을 세로로 정렬
        borderRadius="lg"
        p={8}
        mt={0}
        w={'100%'}>
        <Stack align="start" textAlign="start" margin="auto" ml={10} width={'40%'}>
          <Heading size="6xl" color="white" fontWeight="bold">
            그린 게이지
          </Heading>
          <Text mb="3" fontSize="lg" color="white">
            당신의 한 걸음이 지구의 미소가 됩니다.
          </Text>
          <Link href="/login">
            <Button
              as="a"
              color="white"
              size="lg"
              borderRadius="md"
              fontWeight="bold"
              padding={4}
              colorPalette="gray">
              로그인 <LuArrowRight size="xl" />
            </Button>
          </Link>
        </Stack>
        <MotionBox
          flex="1"
          display="flex"
          justifyContent="end"
          alignItems="center"
          initial={{opacity: 0, scale: 0.85, rotate: -5}}
          animate={{opacity: 1, scale: 1, rotate: 0}}
          transition={{duration: 1.3, delay: 0.2}}>
          <Box as="div" display="flex" justifyContent="center" alignItems="center">
            <Image
              src="/earth-eco.png"
              alt="Eco Earth"
              style={{
                maxWidth: '80%',

                filter: 'drop-shadow(0px 4px 15px rgba(0,0,0,0.3))'
              }}
            />
          </Box>
        </MotionBox>
      </Box>

      {/* 섹션 2 */}
      <Box flex="1" />
      <Flex
        justifyContent="center"
        alignItems="flex-start" // ← 위로 붙이기
        mt={8} // ← margin top 줄이기
        px={{base: 4, md: 16}}
        gap={12}
        flexWrap="wrap">
        {/* 텍스트 메시지 */}
        {/* s
        {/* 지구 이미지 */}
      </Flex>

      {/* 푸터 시작 */}
      <Box
        as="footer"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="black"
        color="white"
        p={50}
        borderRadius="lg"
        mt="auto" // 푸터를 화면 하단에 고정시킴
        opacity={0.6} // 투명도 조정
      >
        <Text fontSize="md" textAlign="center">
          <strong>그린게이지</strong> | 사용자이용약관 개인정보보호정책
        </Text>
        <Text fontSize="sm" textAlign="center" mt={2}>
          본사: 서울시 영등포구 의사당대로 83 오투타워 O2 Tower, 83, Uisadang-daero,
          Yeongdeungpo-gu, Seoul, 07325, Korea
        </Text>
        <Text fontSize="xs" textAlign="center" mt={1}>
          Email: contact@greengauge.com | Phone: +123 456 7890
        </Text>
      </Box>
      {/* 푸터 끝 */}
    </Box>
  )
}
