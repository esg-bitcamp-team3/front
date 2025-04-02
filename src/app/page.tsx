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
          <Heading textStyle="3xl">Welcome to Green Gauge</Heading>
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
        mt={200}
        w={'100%'}>
        <Stack align="start" textAlign="start" margin="auto" ml={10} width={'40%'}>
          <Heading size="6xl" color="white" fontWeight="bold">
            Green Gauge
          </Heading>
          <Text mb="3" fontSize="lg" color="white">
            Join us in making the world greener. Together, we can make a big impact on the
            planet.
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
        opacity={0.6} // 투명도 조정
      >
        <Text fontSize="md" textAlign="center">
          <strong>Green Gauge</strong> | Making the World Greener Together
        </Text>
        <Text fontSize="sm" textAlign="center" mt={2}>
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
