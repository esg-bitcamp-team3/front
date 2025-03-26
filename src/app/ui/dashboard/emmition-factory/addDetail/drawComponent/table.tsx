import {IEmissionFromStationaryCombustion} from '@/lib/api/interfaces/retrieveInterfaces'
import {Table} from '@chakra-ui/react'

export const StationTable = ({
  stationData
}: {
  stationData: IEmissionFromStationaryCombustion[]
}) => {
  return (
    <Table.Root variant="outline" size="sm" showColumnBorder>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>내부시설명</Table.ColumnHeader>
          <Table.ColumnHeader>배출활동</Table.ColumnHeader>
          <Table.ColumnHeader>활동자료</Table.ColumnHeader>
          <Table.ColumnHeader>월별 데이터</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {stationData.map(item => (
          <Table.Row key={item._id}>
            <Table.Cell>{item.facilityName}</Table.Cell>
            <Table.Cell>{item.emissionActivity}</Table.Cell>
            <Table.Cell>{item.activityData}</Table.Cell>
            <Table.Cell>
              {item.data?.map(month => (
                <Table.Cell>{month}</Table.Cell>
              ))}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
