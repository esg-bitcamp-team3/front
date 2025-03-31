import SideNav from '@/app/ui/dashboard/sidenav'
import {Box} from '@chakra-ui/react'
import {NavBar} from '../ui/dashboard/navBar'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <Box
      style={{
        backgroundImage:
          'linear-gradient(to right top, #a4b33a, #82b855, #5fba71, #3bba8d, #14b8a6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      display="flex"
      h="100vh"
      flexDirection={{base: 'column', md: 'row'}}
      overflow="hidden">
      {/* Fix: Use proper responsive syntax */}
      <Box w={{base: 'full', md: '64'}} flex="none">
        <SideNav />
      </Box>

      {/* Fix: Use proper responsive syntax */}
      <Box flexGrow={1} padding={4} overflowY={{md: 'auto'}}>
        <NavBar />
        <Box bg="white" borderRadius="lg" padding={4} h={'full'} overflowY="auto">
          {children}
        </Box>
      </Box>
    </Box>
  )
}
