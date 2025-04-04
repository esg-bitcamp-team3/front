'use client'

import {ModifiyHistory} from '@/app/ui/dashboard/emmition-factory/myprofile/modifyHistory'
import {
  IEmissionInfo,
  ILogByData,
  IUserInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
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
  Table,
  Card
} from '@chakra-ui/react'
import {UserInfo, userInfo} from 'os'
import {use, useEffect, useState} from 'react'

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
  const [changeLog, setChangeLog] = useState<ILogByData | undefined>()
  const [rows, setRows] = useState<IEmissionInfo[]>([])
  const fetchChangeLogs = async () => {
    try {
      const response = await getMyChangeLogs()
      setChangeLog(response.data)
      console.log('response.data', response.data)
      console.log('asdfdsaf', Object.values(response.data))
    } catch {}
  }

  useEffect(() => {
    fetchChangeLogs()
  }, [])

  return (
    <VStack dir="column" w="100%" p={10}>
      {changeLog ? (
        Object.entries(changeLog).map(([key, value]) => (
          <Card.Root width="100%" padding={4}>
            <Card.Body gap="2">
              <Card.Title mt="2">{key}</Card.Title>

              <ModifiyHistory data={value} />
            </Card.Body>
          </Card.Root>
        ))
      ) : (
        <Text>Loading change logs...</Text>
      )}
    </VStack>
  )
}

export default Page
