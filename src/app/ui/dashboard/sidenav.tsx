'use client'

import NavLinks from '@/app/ui/dashboard/nav-links'
import {logout} from '@/lib/api/auth'
import {Box, Link, Flex, Button} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import {FiPower} from 'react-icons/fi' // Using react-icons for the power icon
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
      <Link
        display="flex"
        alignItems="end"
        justifyContent="start"
        mb={2}
        h={{base: '20', md: '40'}}
        p={4}
        rounded="md"
        style={{
          backgroundClip: ' #5fba71'
        }}
        href="/">
        <Box w={{base: '32', md: '40'}} bg="black" color="white" />
      </Link>

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
        <Button
          onClick={handleLogout}
          display="flex"
          h="48px"
          w="full"
          alignItems="center"
          justifyContent="center"
          gap={2}
          rounded="md"
          bg="gray.500"
          p={3}
          fontSize="sm"
          fontWeight="medium"
          _hover={{bg: 'sky.100', color: 'black'}}
          md={{display: 'flex', justifyContent: 'start', px: 3, p: 2}}>
          <LuLogOut size={24} />
          <Box display={{base: 'none', md: 'block'}}>로그아웃</Box>
        </Button>
      </Flex>
    </Box>
  )
}
