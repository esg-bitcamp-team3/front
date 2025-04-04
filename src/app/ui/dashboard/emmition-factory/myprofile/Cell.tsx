import {getFuelData} from '@/lib/api/get'
import {IChangeLogInfo, IFuel} from '@/lib/api/interfaces/retrieveInterfaces'
import {Center, Flex, Table, Text, VStack} from '@chakra-ui/react'
import {m} from 'framer-motion'
import {useEffect, useState} from 'react'
import {LuArrowDown} from 'react-icons/lu'
import {text} from 'stream/consumers'

interface TableCellProps {
  fieldName: string
  value?: number | string
  logs: IChangeLogInfo[]
}

const TableCell: React.FC<TableCellProps> = ({fieldName, value, logs}) => {
  // 특정 필드에 대한 변경 로그 찾기
  const changeLog = logs.find(log => log.fieldName === fieldName)

  const [oldFuel, setOldFuel] = useState<string>()

  const cellStyle = {
    width: '100px', // Set a consistent width
    height: '30px', // Set a consistent height
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'xs'
  }

  if (!changeLog) {
    return (
      <Table.Cell textStyle="xs" textAlign="center" style={cellStyle}>
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
    <Table.Cell textStyle="xs" textAlign="center" style={cellStyle}>
      <VStack mt={1} alignItems="center">
        <Text textDecoration="line-through" color="red.500" fontSize="xs">
          {oldFuel ? oldFuel : changeLog.oldValue}
        </Text>
        <LuArrowDown size="12px" color="gray.500" />
        <Text fontWeight="bold" color="green.500" fontSize="xs">
          {oldFuel ? value : changeLog.newValue}
        </Text>
      </VStack>
    </Table.Cell>
  )
}

export default TableCell
