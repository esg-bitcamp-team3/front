'use client'

import {IUserInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyUser} from '@/lib/api/my'
import {Box, Flex, Text, VStack, Heading, Input, Button, DataList} from '@chakra-ui/react'
import {UserInfo, userInfo} from 'os'
import {use, useEffect, useState} from 'react'

const Page = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [user, setUser] = useState<IUserInfo>()

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    console.log('비밀번호 변경 요청:', {currentPassword, newPassword})
  }
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

        {/* 우측 정보 영역 */}
        <Box w="280px" ml={10}>
          <VStack align="center" gap={3} mb={8}></VStack>

          <Box mb={6}>
            <Text fontWeight="bold" mb={2}>
              계정
            </Text>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>유저명</DataList.ItemLabel>
                <DataList.ItemValue>{user?.name || '-'}</DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>이메일</DataList.ItemLabel>
                <DataList.ItemValue>{user?.email || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Box>

          {/* ✅ 비밀번호 변경 */}
          <Box>
            <Button
              size="sm"
              width="full"
              fontSize="sm"
              fontWeight="normal"
              backgroundColor={showPasswordForm ? 'gray.100' : 'white'}
              _hover={{backgroundColor: showPasswordForm ? 'gray.200' : 'gray.50'}}
              _active={{backgroundColor: showPasswordForm ? 'gray.300' : 'gray.100'}}
              _focus={{boxShadow: 'none'}}
              border="1px solid #e2e8f0"
              colorScheme={showPasswordForm ? 'gray' : 'blue'}
              variant="outline"
              onClick={() => setShowPasswordForm(prev => !prev)}
              mb={3}>
              {showPasswordForm ? '닫기' : '비밀번호 변경'}
            </Button>

            {/* 슬라이딩 폼 영역 */}
            <Box
              maxHeight={showPasswordForm ? '500px' : '0px'}
              overflow="hidden"
              transition="max-height 0.4s ease">
              <VStack
                gap={3}
                align="stretch"
                opacity={showPasswordForm ? 1 : 0}
                transition="opacity 0.4s ease">
                <Box>
                  <Text fontSize="sm" mb={1}>
                    현재 비밀번호
                  </Text>
                  <Input
                    type="password"
                    size="sm"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" mb={1}>
                    새 비밀번호
                  </Text>
                  <Input
                    type="password"
                    size="sm"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" mb={1}>
                    새 비밀번호 확인
                  </Text>
                  <Input
                    type="password"
                    size="sm"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </Box>

                <Button size="sm" colorScheme="blue" onClick={handlePasswordChange}>
                  변경하기
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Page
