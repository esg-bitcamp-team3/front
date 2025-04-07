import SideNav from '@/app/ui/dashboard/sidenav'
import {Box, Text} from '@chakra-ui/react'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <Box bg="white" borderRadius="lg" h={'full'} overflowY="auto">
      {children}
      <Box>
        <Text fontSize="sm" color="gray.600" textAlign="left" padding={4}>
          [출처] 환경부 온실가스 종합정보센터 (2015) 중소기업 인벤토리구축 가이드라인
        </Text>
      </Box>
    </Box>
  )
}
