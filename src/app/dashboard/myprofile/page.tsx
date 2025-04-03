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
  Table
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
      console.log('asdfdsaf', response.data)
    } catch {}
  }

  useEffect(() => {
    fetchChangeLogs()
  }, [])

  // useEffect(() => {
  //   if (changeLog) {
  //     const row = Object.(changeLog) // `changeLog`의 모든 값 가져오기
  //     // 중첩 배열을 평탄화

  //     setRows(row)
  //     console.log('qwer', row)
  //   }
  // }, [changeLog])

  return (
    <Flex minH="100vh">
      <Flex flex={1} p={10} bg="gray.50" justify="space-between"></Flex>
    </Flex>
  )
}

export default Page
