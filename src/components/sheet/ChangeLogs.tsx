import {Badge, Box, Flex, Float, Popover, Separator, Text, VStack} from '@chakra-ui/react'

interface ChangeLogProps {
  _id: string
  colKey: string
  getCellChangeLogs: (_id: string, colKey: string) => any[]
  getColumnDisplayName: (colKey: string) => string
}

const ChangeLogs = ({
  _id,
  colKey,
  getCellChangeLogs,
  getColumnDisplayName
}: ChangeLogProps) => {
  const cellChangeLogs = getCellChangeLogs(_id, colKey) || []
  const hasChangeLogs = cellChangeLogs.length > 0
  return (
    <Popover.Root>
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
              <Text fontWeight="bold">
                {getColumnDisplayName(colKey)} 변경 이력{' '}
                {hasChangeLogs && `(총 ${cellChangeLogs.length}건)`}
              </Text>
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
    </Popover.Root>
  )
}

export default ChangeLogs
