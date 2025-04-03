'use client'

import {ColorModeButton} from '@/components/ui/color-mode'
import {Box, Button, HStack, Link, Tooltip} from '@chakra-ui/react'

const NavBar = () => {
  return (
    <Box top={750} right={-3} position="fixed" p={3} zIndex={1000}>
      <Box margin={12} bg="white" border={50} borderRadius={100} p={2}>
        <HStack gap={3} width="100%" flexDirection="row-reverse">
          <span>
            <Link href="/dashboard/myprofile">
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
            </Link>
          </span>
        </HStack>
      </Box>
    </Box>
  )
}

export {NavBar}
export default NavBar
//         <Link href="/login" passHref>
//           <Button
//             as="a"
//             colorScheme="green"
