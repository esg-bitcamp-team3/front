'use client'

import {
  IChangeLogInfo,
  IEmissionInfo,
  ILogByData,
  ISubsidiary
} from '@/lib/api/interfaces/retrieveInterfaces'
import {emissionInfoMapping} from '@/lib/data/mapping'
import {Table} from '@chakra-ui/react'
import TableCell from './Cell'
import ActivityTableCell from './ActivityCell'

const columnNames = [
  'data1', // 1월
  'data2', // 2월
  'data3', // 3월
  'data4', // 4월
  'data5', // 5월
  'data6', // 6월
  'data7', // 7월
  'data8', // 8월
  'data9', // 9월
  'data10', // 10월
  'data11', // 11월
  'data12' // 12월
]

const getColumnDisplayName = (colKey: string): string => {
  const displayNameMap: Record<string, string> = {
    facilityName: '시설명',
    emissionActivity: '배출 활동',
    activityData: '활동 데이터',
    total: '합계',
    uncertainty: '불확도',
    data1: '1월',
    data2: '2월',
    data3: '3월',
    data4: '4월',
    data5: '5월',
    data6: '6월',
    data7: '7월',
    data8: '8월',
    data9: '9월',
    data10: '10월',
    data11: '11월',
    data12: '12월'
  }

  return displayNameMap[colKey] || colKey
}

interface ModifyHidtoryProps {
  data: IEmissionInfo
  subsidiary: ISubsidiary
  logs: IChangeLogInfo[]
}

export const ModifiyHistory = ({data}: {data: ModifyHidtoryProps[]}) => {
  // const [emissionData, subsidiary, logs] = props

  return (
    <>
      <Table.Root size="sm" showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              사업장
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              연도
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              번호
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              내부 시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              활동자료
            </Table.ColumnHeader>

            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              단위
            </Table.ColumnHeader>
            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              합계
            </Table.ColumnHeader>
            {/* Monthly columns */}
            {columnNames.map(col => (
              <Table.ColumnHeader
                key={col}
                p={2}
                justifyContent="center"
                textAlign="center"
                fontWeight="bold"
                textStyle="xs">
                {getColumnDisplayName(col)}
              </Table.ColumnHeader>
            ))}

            <Table.ColumnHeader
              p={2}
              justifyContent="center"
              textAlign="center"
              fontWeight="bold"
              textStyle="xs">
              불확도
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(data => (
            <Table.Row key={data.data._id}>
              <Table.Cell textStyle="xs">{data.subsidiary?.name}</Table.Cell>

              <TableCell fieldName="year" value={data.data.year} logs={data.logs} />
              <TableCell
                fieldName="serialNumber"
                value={data.data.serialNumber}
                logs={data.logs}
              />
              <TableCell
                fieldName="facilityName"
                value={data.data.facilityName}
                logs={data.logs}
              />
              <TableCell
                fieldName="emissionActivity"
                value={data.data.emissionActivity}
                logs={data.logs}
              />
              <ActivityTableCell
                fieldName="activityData"
                value={data.data.activityData?.name}
                logs={data.logs}
              />
              <TableCell fieldName="total" value={data.data.total} logs={data.logs} />
              <TableCell
                fieldName="uncertainty"
                value={data.data.uncertainty}
                logs={data.logs}
              />
              <TableCell fieldName="data1" value={data.data.data1} logs={data.logs} />
              <TableCell fieldName="data2" value={data.data.data2} logs={data.logs} />
              <TableCell fieldName="data3" value={data.data.data3} logs={data.logs} />
              <TableCell fieldName="data4" value={data.data.data4} logs={data.logs} />
              <TableCell fieldName="data5" value={data.data.data5} logs={data.logs} />
              <TableCell fieldName="data6" value={data.data.data6} logs={data.logs} />
              <TableCell fieldName="data7" value={data.data.data7} logs={data.logs} />
              <TableCell fieldName="data8" value={data.data.data8} logs={data.logs} />
              <TableCell fieldName="data9" value={data.data.data9} logs={data.logs} />
              <TableCell fieldName="data10" value={data.data.data10} logs={data.logs} />
              <TableCell fieldName="data11" value={data.data.data11} logs={data.logs} />
              <TableCell fieldName="data12" value={data.data.data12} logs={data.logs} />
              <TableCell
                fieldName="uncertainty"
                value={data.data.uncertainty}
                logs={data.logs}
              />
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}
