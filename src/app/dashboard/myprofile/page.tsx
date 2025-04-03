'use client'

import {ILogByDate, IUserInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyChangeLogs, getMyUser} from '@/lib/api/my'
import {emissionInfoMapping} from '@/lib/data/mapping'
import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Input,
  Button,
  DataList,
  Separator,
  Menu,
  Portal,
  Table
} from '@chakra-ui/react'
import {UserInfo, userInfo} from 'os'
import {use, useEffect, useState} from 'react'
import {Cell} from './Cell'
import {ModifiedHistory} from '@/app/ui/dashboard/myprofile/modifiedHistory'

const columnNames = [
  'data1', // 1월
  'data2', // 2월
  'data3', // 3월
  'data4', // 4월
  'data5', // 5월
  'data6', // 6월
  'data7', // 7월
  'data8', // 8월
  'data9', // 9월
  'data10', // 10월
  'data11', // 11월
  'data12' // 12월
]

const Page = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [user, setUser] = useState<IUserInfo>()
  const [changeLog, setChangeLog] = useState<ILogByDate | undefined>()

  const fetchChangeLogs = async () => {
    try {
      const response = await getMyChangeLogs()
      setChangeLog(response.data)
      console.log('asdfdsaf', response.data)
    } catch {}
  }

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
    fetchChangeLogs()
  }, [])

  return (
    <Flex minH="100vh">
      <Flex flex={1} p={10} bg="gray.50" justify="space-between">
        {/* 가운데 콘텐츠 */}
        <Box flex={1} maxW="800px">
          <Heading size="xl" mb={6}>
            수정내역
          </Heading>
          {
            changeLog &&
              Object.entries(changeLog).map(([logKey, log]) => (
                <Box key={logKey}>
                  {log.log.map((data, index) => (
                    <EmissionTable emissionData={data.emissionData} />
                  ))}
                </Box>
              ))

            // Object.entries(changeLog).map(([key, log]) => (
            //   <Box key={key}>
            //     <Text>{key}</Text>
            //     {changeLog[key].log.map(data => (
            //       <VStack align="stretch" gap={1} separator={<Separator />}>
            //         <Box key={data.changeLog.fieldName} py={1} px={2}>
            //           {/* {Object.entries(data.emissoinData).map(([key, val]) => (
            //             <Cell
            //               props={{
            //                 rowIndex: data.changeLog.entityId,
            //                 colKey: emissionInfoMapping[key],
            //                 value: val
            //               }}
            //             />
            //           ))} */}
            //           {/* <Cell
            //             props={{
            //               rowIndex: data.changeLog.entityId,
            //               colKey: emissionInfoMapping[data.emissoinData.data1],
            //               value: data.emissoinData.data1
            //             }}
            //           /> */}
            //           <Flex mt={0.3} alignItems="center">
            //             <Text mx={1} color="gray.500">
            //               {emissionInfoMapping[data.changeLog.fieldName]}
            //             </Text>
            //             <Text textDecoration="line-through" color="red.500" fontSize="sm">
            //               {data.changeLog.oldValue}
            //             </Text>
            //             <Text mx={1} color="gray.500">
            //               →
            //             </Text>
            //             <Text fontWeight="bold" color="green.500" fontSize="sm">
            //               {data.changeLog.newValue}
            //             </Text>
            //           </Flex>
            //         </Box>
            //       </VStack>
            //     ))}
            //   </Box>
            // ))
          }

          {/* {data.emissionData[0]?.logs.map(log => (
                      <VStack align="stretch" gap={1} separator={<Separator />}>
                        <Box key={index} py={1} px={2}>
                          <Flex mt={0.3} alignItems="center">
                            <Text mx={1} color="gray.500">
                              {emissionInfoMapping[log.fieldName]}
                            </Text>
                            <Text
                              textDecoration="line-through"
                              color="red.500"
                              fontSize="sm">
                              {log.oldValue}
                            </Text>
                            <Text mx={1} color="gray.500">
                              →
                            </Text>
                            <Text fontWeight="bold" color="green.500" fontSize="sm">
                              {log.newValue}
                            </Text>
                          </Flex>
                        </Box>
                      </VStack>
                    ))} */}
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
