import {Box, Text, Flex} from '@chakra-ui/react'
import ChangeLogs from './ChangeLogs'

interface CellProps {
  rowIndex: string //entityId
  colKey: string // fieldName
  value: number | string
  oldValue?: number | string
}

export const Cell = ({props}: {props: CellProps}) => {
  return (
    <Box
      position="relative"
      width="100%"
      data-row={props.rowIndex}
      data-col={props.colKey}>
      {/* {props.oldValue && ( */}
      <Flex mt={0.3} alignItems="center">
        <Text textDecoration="line-through" color="red.500" fontSize="sm">
          {props.oldValue}
        </Text>
        <Text mx={1} color="gray.500">
          →
        </Text>
        <Text fontWeight="bold" color="green.500" fontSize="sm">
          {props.value}
        </Text>
      </Flex>
      {/* )} */}
    </Box>
  )
}
