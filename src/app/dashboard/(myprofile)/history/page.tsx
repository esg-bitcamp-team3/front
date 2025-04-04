'use client'

import {IUserInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyUser} from '@/lib/api/my'
import {Box, Flex, Text, VStack, Heading, Input, Button, DataList} from '@chakra-ui/react'
import {UserInfo, userInfo} from 'os'
import {use, useEffect, useState} from 'react'

const Page = () => {
  const [user, setUser] = useState<IUserInfo>()

  useEffect(() => {
    const fetchuser = async () => {
      const response = await getMyUser()
      setUser(response.data)
    }
    fetchuser()
  }, [])

  return (
    <Flex minH="100vh">
      <Flex flex={1} p={10} bg="gray.50" justify="space-between">
        {/* 가운데 콘텐츠 */}
        <Box flex={1} maxW="800px">
          <Heading size="xl" mb={6}>
            수정내역
          </Heading>

          {[1, 2, 3].map(item => (
            <Box key={item} bg="white" p={4} borderRadius="md" mb={4} boxShadow="sm">
              <Text fontSize="sm" color="gray.500">
                08/10 03:23
              </Text>
              <Text fontWeight="semibold" mt={2}>
                장그래
              </Text>
              <Box mt={3} p={3} border="1px solid #e2e8f0" borderRadius="md">
                <Text fontSize="xs" color="gray.500">
                  부산사업장
                </Text>
                <Text mt={1}>매출수정</Text>
                <Text fontSize="sm" color="gray.500">
                  1500 up
                </Text>
              </Box>
              <Text mt={2} fontSize="sm" color="green.500" textAlign="right">
                수정 확인
              </Text>
            </Box>
          ))}
        </Box>
      </Flex>
    </Flex>
  )
}
export default Page
