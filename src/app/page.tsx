import Link from 'next/link'
import {lusitana} from '@/app/ui/fonts'
import {Box, Text, Button, Stack, Flex, Heading} from '@chakra-ui/react'
import {LuArrowRight} from 'react-icons/lu'

export default function Page() {
  return (
    <Box
      as="main"
      display="flex"
      minH="100vh"
      flexDirection="column"
      p={6}
      bg="white"
      style={{
        backgroundImage: 'url("/bg.jpg")', // 배경 이미지 설정
        backgroundSize: 'cover', // 배경 이미지가 화면 크기에 맞게 크기 조정
        backgroundPosition: 'center', // 배경 이미지가 화면 중앙에 위치하도록 설정
        backgroundRepeat: 'no-repeat' // 배경 이미지 반복 방지
      }}>
      {/* 상단 타이틀과 로고 */}
      <Text
        className={lusitana.className}
        fontSize={{base: 'xl', md: '3xl'}}
        color="green.600"
        lineHeight={{md: 'normal'}}
        mb={6}
        textAlign="center">
        <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
          {' '}
          <Link href="/">
            <Button as="a" bg="rgba(0, 0, 0, 0.0)" color="white" padding={4}>
              <img
                src="/gglogo.png"
                alt="Green Gauge Logo"
                style={{width: '50px', height: '50px'}}
              />{' '}
            </Button>
          </Link>
          <strong>Welcome to Green Gauge</strong>
        </Box>
      </Text>

      {/* 환경 관련 메시지, 로그인 버튼을 중앙에 배치 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // 버튼을 세로로 정렬
        bg="rgba(0, 0, 0, 0.5)" // 투명한 배경을 넣어 이미지가 보이도록 설정
        borderRadius="lg"
        p={8}
        mb={8}
        w={'100%'}
        mx={0}>
        <Stack align="center" textAlign="center">
          <Heading size="4xl" color="white">
            Green Gauge
          </Heading>
          <Text mb="3" fontSize="lg" color="white">
            Join us in making the world greener. Together, we can make a big impact on the
            planet.
          </Text>
          <Link href="/login">
            <Button
              as="a"
              bg="green.500"
              color="white"
              _hover={{bg: 'green.400'}}
              size="lg"
              borderRadius="md"
              fontWeight="bold"
              padding={4}>
              Login <LuArrowRight size="xl" />
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* 섹션 2 */}
      <Box flex="1" />

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
      >
        <Text fontSize="lg" textAlign="center">
          <strong>Green Gauge</strong> | Making the World Greener Together
        </Text>
        <Text fontSize="lg" textAlign="center" mt={2}>
          Address: 123 Green St, Eco City, Earth
        </Text>
        <Text fontSize="xs" textAlign="center" mt={1}>
          Email: contact@greengauge.com | Phone: +123 456 7890
        </Text>
      </Box>
      {/* 푸터 끝 */}
    </Box>
  )
}
