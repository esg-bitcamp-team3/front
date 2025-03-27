'use effect'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {getStationaryCombustion} from '@/lib/api/get'
import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'

const months = Array.from({length: 12}, (_, i) => `${i + 1}월`)

export const StationTable = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [value, setValue] = useState<string>('2023')
  const year = ['2020', '2021', '2022', '2023', '2024', '2025']
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()

  const [data, setData] = useState<IEmissionInfo[]>()

  const pullData = async () => {
    try {
      const response = await getStationaryCombustion(subsidiaryId, value, page)
      setData(response.data)
      setTotal(response.total)
    } catch (error) {}
  }

  useEffect(() => {
    pullData()
  }, [value, page])

  return (
    <Stack width="full" gap="5" justifyContent="center" alignItems="center">
      <YearSelector props={{value: value, valueList: year, onValueChange: setValue}} />
      <Table.Root
        variant="outline"
        size="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              padding={3}
              w="auto"
              minW="max-content"
              whiteSpace="nowrap"
              color="blue.500"
              textAlign="center">
              내부시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={3}
              w="auto"
              minW="max-content"
              whiteSpace="nowrap"
              color="blue.500"
              textAlign="center">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={3}
              w="auto"
              minW="max-content"
              whiteSpace="nowrap"
              color="blue.500"
              textAlign="center">
              활동자료
            </Table.ColumnHeader>

            {months.map(month => (
              <Table.ColumnHeader
                key={month}
                padding={3}
                w="auto"
                minW="max-content"
                whiteSpace="nowrap"
                color="blue.500"
                textAlign="center">
                {month}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data &&
            data.map(item => (
              <Table.Row key={item._id} _hover={{bg: 'gray.100'}}>
                <Table.Cell
                  padding={3}
                  textAlign="center"
                  whiteSpace="normal"
                  wordBreak="break-word">
                  {item.facilityName}
                </Table.Cell>
                <Table.Cell
                  padding={3}
                  textAlign="center"
                  whiteSpace="normal"
                  wordBreak="break-word">
                  {item.emissionActivity}
                </Table.Cell>
                <Table.Cell
                  padding={3}
                  textAlign="center"
                  whiteSpace="normal"
                  wordBreak="break-word">
                  {item.activityData?.name}
                </Table.Cell>
                {item.data?.map(month => (
                  <Table.Cell
                    key={month}
                    fontSize="sm"
                    textAlign="center"
                    color="gray.700">
                    {month.toFixed(1)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      {total && total > 0 && (
        <Pagination.Root page={page} count={total} pageSize={10} defaultPage={1}>
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={page => (
                <IconButton variant={{base: 'ghost', _selected: 'outline'}}>
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      )}
    </Stack>
  )
}
