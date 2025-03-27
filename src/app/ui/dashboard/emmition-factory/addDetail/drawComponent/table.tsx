import {IEmissionFromStationaryCombustion} from '@/lib/api/interfaces/retrieveInterfaces'
import {HStack, Stack, Table, Text} from '@chakra-ui/react'

export const StationTable = ({
  stationData
}: {
  stationData: IEmissionFromStationaryCombustion[]
}) => {
  return (
    <Stack gap="10" px="8">
      <Table.Root size="lg">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="7rem" color="blue.500" textAlign="center">
              내부시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader w="7rem" color="blue.500" textAlign="center">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader w="8rem" color="blue.500" textAlign="center">
              활동자료
            </Table.ColumnHeader>
            <Table.ColumnHeader color="blue.500" textAlign="center">
              월별 배출량
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {stationData.map(item => (
            <Table.Row>
              <Table.Cell px="1" py="3">
                {item.facilityName}
              </Table.Cell>
              <Table.Cell px="1" py="3">
                {item.emissionActivity}
              </Table.Cell>
              <Table.Cell px="1" py="3">
                {item.activityData}
              </Table.Cell>
              <Table.Cell px="1" py="3">
                <HStack>
                  {item.data?.map(month => (
                    <Text>{month}</Text>
                  ))}
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  )
}
