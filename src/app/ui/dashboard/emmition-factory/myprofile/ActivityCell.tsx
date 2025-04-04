import {getFuelData} from '@/lib/api/get'
import {IChangeLogInfo, IFuel} from '@/lib/api/interfaces/retrieveInterfaces'
import {Center, Flex, Table, Text, VStack} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {LuArrowDown} from 'react-icons/lu'
import {text} from 'stream/consumers'

interface TableCellProps {
  fieldName: string
  value?: number | string
  logs: IChangeLogInfo[]
}

const ActivityTableCell: React.FC<TableCellProps> = ({fieldName, value, logs}) => {
  // 특정 필드에 대한 변경 로그 찾기
  const changeLog = logs.find(log => log.fieldName === fieldName)
  const isChanged = !!changeLog

  const [oldFuel, setOldFuel] = useState<string>()

  const cellStyle = {
    width: '150px', // Set a consistent width
    height: '50px', // Set a consistent height
    alignItems: 'center',
    justifyContent: 'center'
  }

  if (!changeLog) {
    return (
      <Table.Cell textAlign="center" style={cellStyle}>
        {value}
      </Table.Cell>
    )
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await getFuelData({id: changeLog.oldValue as string})
      setOldFuel(response.data?.name)
    }
    fetchData()
  }, [])

  return (
    <Table.Cell textAlign="center" style={cellStyle}>
      <VStack mt={1} alignItems="center">
        <Text textDecoration="line-through" color="red.500" fontSize="sm">
          {oldFuel}
        </Text>
        <LuArrowDown size="12px" color="gray.500" />
        <Text fontWeight="bold" color="green.500" fontSize="sm">
          {value}
        </Text>
      </VStack>
    </Table.Cell>
  )
}

export default ActivityTableCell
