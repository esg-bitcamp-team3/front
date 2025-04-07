'use client'

import {ModifiyHistory} from '@/app/ui/dashboard/emmition-factory/myprofile/modifyHistory'
import {ILogByData} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyChangeLogs} from '@/lib/api/my'

import {Flex, Text, VStack, Card, Spinner} from '@chakra-ui/react'

import {useEffect, useState} from 'react'

const Page = () => {
  const [changeLog, setChangeLog] = useState<ILogByData | undefined>()
  const [loading, setLoading] = useState(true)
  const fetchChangeLogs = async () => {
    try {
      setLoading(true)
      const response = await getMyChangeLogs()
      setChangeLog(response.data)
      console.log('response.data', response.data)
      console.log('asdfdsaf', Object.values(response.data))
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChangeLogs()
  }, [])

  return (
    <Flex direction="column" gap="4">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bolder">
          수정 내역
        </Text>
      </Flex>
      <VStack dir="column" w="100%" p={10}>
        {loading ? (
          <Spinner />
        ) : changeLog && Object.keys(changeLog).length > 0 ? (
          Object.entries(changeLog).map(([key, value]) => (
            <Card.Root width="100%" padding={4}>
              <Card.Body gap="2">
                <Card.Title mt="2">{key}</Card.Title>
                <Card.Description>{value[0].subsidiary.name}</Card.Description>
                <ModifiyHistory data={value} />
              </Card.Body>
            </Card.Root>
          ))
        ) : (
          <Text>수정내역이 없습니다</Text>
        )}
      </VStack>
    </Flex>
  )
}

export default Page
