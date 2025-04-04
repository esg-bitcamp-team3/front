'use client'

import {ModifiyHistory} from '@/app/ui/dashboard/emmition-factory/myprofile/modifyHistory'
import {ILogByData} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyChangeLogs} from '@/lib/api/my'

import {Flex, Text, VStack, Card} from '@chakra-ui/react'

import {useEffect, useState} from 'react'

const Page = () => {
  const [changeLog, setChangeLog] = useState<ILogByData | undefined>()
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
    <Flex direction="column" gap="4">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bolder">
          사업장 목록
        </Text>
      </Flex>
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
    </Flex>
  )
}

export default Page
