'use client'

import NavLinks from '@/app/ui/dashboard/nav-links'
import {logout} from '@/lib/api/auth'
import {Box, Link, Flex, Button, Image, Text, Heading} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import {LuLogOut} from 'react-icons/lu'

export default function SideNav() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box display="flex" h="full" flexDirection="column" px={3} py={4} md={{px: 2}}>
      {/* 로고/홈 이미지 링크 */}
      <Link
        href="/"
        mb={8}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="150px"
        width="250px">
        <Box
          padding={2}
          width="100%"
          bg="#5fba71"
          borderRadius="lg"
          height={'100%'}
          alignItems="center">
          <Image
            src="/project_logo.png"
            alt="Green Gauge Logo"
            width="full"
            height="auto"
            paddingTop={2}
          />
        </Box>
      </Link>

      {/* 네비게이션 및 로그아웃 버튼 */}
      <Flex
        direction={{base: 'row', md: 'column'}}
        justify="space-between"
        gap={2}
        flexGrow={1}>
        <NavLinks />
        <Box
          display={{base: 'none', md: 'block'}}
          h="auto"
          w="full"
          flexGrow={1}
          rounded="md"
          bg="gray.50"
        />
      </Flex>
    </Box>
  )
}
