import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'

export const StationTable = ({stationData}: {stationData: IEmissionInfo[]}) => {
  return (
    <Stack width="full" gap="5">
      <Table.Root size="sm" variant="outline" striped>
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
            <Table.Row key={item._id}>
              <Table.Cell px="1" py="3">
                {item.facilityName}
              </Table.Cell>
              <Table.Cell px="1" py="3">
                {item.emissionActivity}
              </Table.Cell>
              <Table.Cell px="1" py="3">
                {item.activityData?.name}
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
      <Pagination.Root count={stationData.length * 5} pageSize={5} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
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
    </Stack>
  )
}
