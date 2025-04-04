'use client'

import {ColorModeButton} from '@/components/ui/color-mode'
import {logout} from '@/lib/api/auth'
import {Box, Button, HStack, Link, VStack, Text} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {LuLogOut} from 'react-icons/lu'

const NavBar = () => {
  const [isHovered, setIsHovered] = useState(false)
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
    <Box bottom="-2%" right="-2%" position="fixed" p={3} zIndex={1000}>
      <Box
        margin={12}
        bg="white"
        border={50}
        borderRadius={100}
        p={2}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative">
        <HStack gap={3} width="100%" flexDirection="row-reverse">
          <Button
            as="a"
            bg="transparent"
            padding={0}
            _hover={{bg: 'transparent'}}
            _active={{bg: 'transparent'}}>
            <img
              src="/usericon.png"
              alt="user icon"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'transparent'
              }}
            />
          </Button>
        </HStack>

        {/* Hover 메뉴 */}
        {isHovered && (
          <Box
            position="absolute"
            bottom="60px"
            right="0"
            bg="gray.100"
            borderRadius="md"
            boxShadow="md"
            p={3}
            zIndex={10}
            minW="100px"
            minH="30px">
            <VStack align="center" gap={1}>
              <Button variant={'ghost'}>
                <Link href="/dashboard/history">
                  <Text _hover={{color: 'blue.500', cursor: 'pointer'}}>수정내역</Text>
                </Link>
              </Button>
              <Button variant={'ghost'}>
                <Link href="/dashboard/my">
                  <Text _hover={{color: 'blue.500', cursor: 'pointer'}}>정보수정</Text>
                </Link>
              </Button>
              <Button variant={'ghost'} onClick={handleLogout}>
                <Text>
                  <Text _hover={{color: 'blue.500', cursor: 'pointer'}}>로그아웃</Text>
                </Text>
              </Button>
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default NavBar
