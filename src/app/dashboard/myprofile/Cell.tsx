import {Box, Text} from '@chakra-ui/react'
import ChangeLogs from './ChangeLogs'

interface CellProps {
  oldvalue: number | string
  rowIndex: number
  colKey: string
}

export const Cell = ({props}: {props: CellProps}) => {
  return (
    <Box
      position="relative"
      width="100%"
      data-row={props.rowIndex}
      data-col={props.colKey}>
      {/* <Text>{props.value}</Text> */}
    </Box>
  )
}
