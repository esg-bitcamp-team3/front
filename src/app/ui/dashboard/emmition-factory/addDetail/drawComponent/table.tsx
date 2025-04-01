'use effect'

import {
  getEmissionDataFromStationaryCombustion,
  getEmissionDataFromMobileCombustion,
  getEmissionDataFromElectricity,
  getEmissionDataFromSteam
} from '@/lib/api/get'
import {IEmissionInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {ButtonGroup, IconButton, Pagination, Stack, Table, Text} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'

interface YearAndData {
  year: string
  subsidiaryId: string
  dataType: string
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const StationTable = ({props}: {props: YearAndData}) => {
  const {year, subsidiaryId, dataType} = props
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()

  const [data, setData] = useState<IEmissionInfo[]>()

  const pullData = async () => {
    try {
      let response
      if (dataType === 'station') {
        response = await getEmissionDataFromStationaryCombustion({
          id: subsidiaryId,
          year: year,
          page: page
        })
      } else if (dataType === 'mobile') {
        response = await getEmissionDataFromMobileCombustion({
          id: subsidiaryId,
          year: year,
          page: page
        })
      } else if (dataType === 'electric') {
        response = await getEmissionDataFromElectricity({
          id: subsidiaryId,
          year: year,
          page: page
        })
      } else {
        response = await getEmissionDataFromSteam({
          id: subsidiaryId,
          year: year,
          page: page
        })
      }
      setData(response?.data)
      setTotal(response?.total)
    } catch (error) {}
  }

  useEffect(() => {
    pullData()
  }, [year, page, dataType])

  return (
    <Stack width="full" gap="5">
      <Stack direction="row" justifyContent="flex-end" pr="3">
        <Text fontSize="sm" color="gray.500">
          단위: tCO2eq
        </Text>
      </Stack>
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
              w="1/6.3"
              whiteSpace="nowrap"
              color="#CCB8EA"
              fontWeight="bold"
              textAlign="center">
              내부시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={3}
              w="1/6.3"
              whiteSpace="nowrap"
              color="#CCB8EA"
              fontWeight="bold"
              textAlign="center">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={3}
              w="1/6.3"
              whiteSpace="nowrap"
              color="#CCB8EA"
              fontWeight="bold"
              textAlign="center">
              활동자료
            </Table.ColumnHeader>

            {months.map(month => (
              <Table.ColumnHeader
                key={month}
                padding={3}
                w="auto"
                color="black"
                fontWeight="black"
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
                  wordBreak="break-word"
                  color="black"
                  fontWeight="bold">
                  {item.facilityName}
                </Table.Cell>
                <Table.Cell
                  padding={3}
                  textAlign="center"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  color="black"
                  fontWeight="bold">
                  {item.emissionActivity}
                </Table.Cell>
                <Table.Cell
                  padding={3}
                  textAlign="center"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  color="black"
                  fontWeight="bold">
                  {item.activityData?.name}
                </Table.Cell>
                {[
                  item.data1,
                  item.data2,
                  item.data3,
                  item.data4,
                  item.data5,
                  item.data6,
                  item.data7,
                  item.data8,
                  item.data9,
                  item.data10,
                  item.data11,
                  item.data12
                ].map((value, index) => (
                  <Table.Cell
                    key={index}
                    fontSize="sm"
                    textAlign="center"
                    color="gray.700">
                    {value.toFixed(1)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      {total && total > 0 && (
        <Pagination.Root
          page={page}
          count={total}
          pageSize={10}
          defaultPage={1}
          textAlign="center">
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
