import {ColorModeButton} from '@/components/ui/color-mode'
import {Avatar, Box, HStack} from '@chakra-ui/react'

const NavBar = () => {
  return (
    <Box top={0} right={0} position="fixed" p={3} zIndex={1000}>
      <Box margin={4} bg="white" border={1} borderRadius={10} p={3}>
        <HStack gap={3} width="100%" flexDirection="row-reverse">
          <Avatar.Root>
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src="https://bit.ly/sage-adebayo" />
          </Avatar.Root>
          <ColorModeButton />
        </HStack>
      </Box>
    </Box>
  )
}

export {NavBar}
