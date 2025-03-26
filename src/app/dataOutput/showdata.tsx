import {getStationaryData} from '@/lib/api/get'
import {Table, TableCell, Badge, Stat, VStack} from '@chakra-ui/react'
import {useEffect, useState} from 'react'

export function Show_Data(subsidary: string) {
  // const [data, setData] = useState<Array<{ year: number; total: number }> | null>(null)

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await getStationaryData(subsidary)
  //     // year와 total만 추출
  //     const filteredData = result.map((item: any) => ({
  //       year: item.year,
  //       total: item.total,
  //     }))
  //     setData(filteredData)
  //   }
  //   fetchData()
  // }, [subsidary])

  return (
    <VStack>
      <Stat.Root>
        <Stat.Label>온실가스 배출량</Stat.Label>
        <Stat.ValueText>scope의 합</Stat.ValueText>
        <Badge colorPalette="red" variant="plain" px="0">
          <Stat.DownIndicator />
          1.9%
        </Badge>
      </Stat.Root>

      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Scope</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">배출량</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <TableCell>고정연소</TableCell>
            <TableCell>배출량의 합</TableCell>
          </Table.Row>
          <Table.Row>
            <TableCell>이동연소</TableCell>
            <TableCell>배출량의 합</TableCell>
          </Table.Row>
          <Table.Row>
            <TableCell>간접연소(전기)</TableCell>
            <TableCell>배출량의 합</TableCell>
          </Table.Row>
          <Table.Row>
            <TableCell>간접연소(열&스팀)</TableCell>
            <TableCell>배출량의 합</TableCell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </VStack>
  )
}
