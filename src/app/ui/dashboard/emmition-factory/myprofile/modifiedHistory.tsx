'use client'

import {
  IEmissionInfo,
  ILogByDate,
  IUserInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyChangeLogs} from '@/lib/api/my'
import {emissionInfoMapping} from '@/lib/data/mapping'
import {Box, Flex, Text, Table, Stack} from '@chakra-ui/react'
import {useEffect, useState} from 'react'

interface ModifiedHistoryProps {}

export const ModifiedHistory = (emissionData: Object) => {
  const [changeLog, setChangeLog] = useState<ILogByDate | undefined>()

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

  return (
    <Stack gap="5">
      <Table.Root
        variant="outline"
        size="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        showColumnBorder>
        <Table.Header>
          <Table.Row>
            {Object.keys(emissionData).map(key => (
              <Table.ColumnHeader
                key={key}
                padding={3}
                w="1/6.3"
                whiteSpace="nowrap"
                color="#CCB8EA"
                fontWeight="bold"
                textAlign="center">
                {emissionInfoMapping[key] || key}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row key={emissionData._id} _hover={{bg: 'gray.100'}}>
            {Object.entries(emissionData).map(([key, val]) => (
              <Table.Cell
                key={key}
                padding={3}
                textAlign="center"
                whiteSpace="normal"
                wordBreak="break-word"
                color="black"
                fontWeight="bold">
                {val}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Stack>

    // <Flex flex={1} p={10} bg="gray.50" justify="space-between">
    //   {/* 가운데 콘텐츠 */}
    //   <Box flex={1} maxW="800px">
    //     {changeLog &&
    //       Object.entries(changeLog).map(([logKey, log]) => (
    //         <Box key={logKey}>
    //           <Text>{logKey}</Text>
    //           {log.log.map((data, index) => (
    //             <Table.Root
    //               key={`${logKey}-${index}`}
    //               variant="outline"
    //               size="sm"
    //               borderWidth="1px"
    //               borderRadius="lg"
    //               overflow="hidden"
    //               showColumnBorder>
    //               <Table.Header>
    //                 <Table.Row>
    //                   {Object.entries(data.emissoinData).map(([key, val]) => (
    //                     <Table.ColumnHeader
    //                       key={key}
    //                       padding={3}
    //                       w="1/6.3"
    //                       whiteSpace="nowrap"
    //                       color="#CCB8EA"
    //                       fontWeight="bold"
    //                       textAlign="center">
    //                       {emissionInfoMapping[key] || key}
    //                     </Table.ColumnHeader>
    //                   ))}
    //                 </Table.Row>
    //               </Table.Header>

    //               <Table.Body>
    //                 <Table.Row key={data.emissoinData._id} _hover={{bg: 'gray.100'}}>
    //                   {Object.entries(data.emissoinData).map(([key, val]) => (
    //                     <Table.Cell
    //                       key={key}
    //                       padding={3}
    //                       textAlign="center"
    //                       whiteSpace="normal"
    //                       wordBreak="break-word"
    //                       color="black"
    //                       fontWeight="bold">
    //                       {val}
    //                     </Table.Cell>
    //                   ))}{' '}
    //                 </Table.Row>
    //               </Table.Body>
    //             </Table.Root>
    //           ))}
    //         </Box>
    //       ))}
    //   </Box>
    // </Flex>
  )
}
