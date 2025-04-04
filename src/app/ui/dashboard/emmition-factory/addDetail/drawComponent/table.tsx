'use effect'

import ModifyEmissionData from '@/components/sheet/ModifyDialog'
import {
  getEmissionDataFromStationaryCombustion,
  getEmissionDataFromMobileCombustion,
  getEmissionDataFromElectricity,
  getEmissionDataFromSteam
} from '@/lib/api/get'
import {IEmissionInfo} from '@/lib/api/interfaces/retrieveInterfaces'

import {
  Button,
  ButtonGroup,
  IconButton,
  Pagination,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {use, useEffect, useState} from 'react'

import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'
import {EmissionProps} from '../../subTabData'

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

export const StationTable = ({data}: {data: IEmissionInfo[]}) => {
  return (
    <Stack width="full" gap="5">
      <Stack direction="row" justifyContent="flex-end" pr="3">
        <Text fontSize="sm" color="gray.500">
          단위: tCO2eq
        </Text>
      </Stack>
      <Table.Root
        marginTop={4}
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
    </Stack>
  )
}
