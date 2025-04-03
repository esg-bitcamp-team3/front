import {HotTable, HotColumn} from '@handsontable/react-wrapper'
import {Badge, Box, Flex, Float, Popover, Separator, Text, VStack} from '@chakra-ui/react'
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.css'
import 'handsontable/styles/ht-theme-main.css'
import {IChangeLogInfo} from '@/lib/api/interfaces/retrieveInterfaces'

type RendererProps = {
  TD?: HTMLTableCellElement
  value?: string | number
  row?: number
  col?: number
  cellProperties?: Handsontable.CellProperties
}

const getColumnNameByIndex = (colIndex: number): string => {
  const columnNames = [
    '선택',
    '연도',
    '일련번호',
    '내부시설명',
    '배출활동',
    '활동자료',
    '단위',
    '합계',
    '불확도',
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
    '_id'
  ]

  return columnNames[colIndex] || `컬럼 ${colIndex}`
}

// your renderer component
const RendererComponent = (
  props: RendererProps & {changeLog: Record<number, IChangeLogInfo[]>}
) => {
  // the available renderer-related props are:
  // - `row` (row index)
  // - `col` (column index)
  // - `prop` (column property name)
  // - `TD` (the HTML cell element)
  // - `cellProperties` (the `cellProperties` object for the edited cell)
  const {TD, value, row, col, cellProperties, changeLog} = props

  if (!TD || !row || !col || !cellProperties || !changeLog) {
    return null
  }

  const cellChangeLogs = changeLog[row] || []

  return (
    <div>
      <div>{value}asdf</div>
      {/* <Popover.Root>
        <Popover.Trigger asChild>
          <Float
            zIndex={2}
            offset={2}
            onClick={e => {
              e.stopPropagation() // Prevent triggering parent click events
            }}>
            <Badge px={2} size="xs" variant="solid" colorPalette="yellow">
              {cellChangeLogs.length}
            </Badge>
          </Float>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content width="280px" boxShadow="md">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Header>
              <Flex padding={4} justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold"></Text>
                <Popover.CloseTrigger />
              </Flex>
            </Popover.Header>
            <Separator />
            <Popover.Body maxHeight="250px" overflowY="auto" p={2}>
              <VStack align="stretch" gap={1} separator={<Separator />}>
                {cellChangeLogs
                  .sort((a, b) =>
                    b.modifiedAt ? b.modifiedAt.localeCompare(a.modifiedAt || '') : 0
                  )
                  .map((log, index) => (
                    <Box key={index} py={1} px={2}>
                      <Text fontSize="xs" color="gray.500">
                        {log.modifiedAt
                          ? new Date(log.modifiedAt).toLocaleString('ko-KR')
                          : '날짜 정보 없음'}
                        {' • '}
                        {log.modifiedBy ? log.modifiedBy.name : '알 수 없음'}
                      </Text>
                      <Flex mt={1} alignItems="center">
                        <Text textDecoration="line-through" color="red.500" fontSize="sm">
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
                  ))}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root> */}
    </div>
  )
}

export default RendererComponent
