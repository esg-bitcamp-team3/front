'use client'

import {useEffect, useState} from 'react'
import {Box, Flex, Text, HStack, DataList, Card, Table} from '@chakra-ui/react'
import {LuArrowUp, LuArrowDown} from 'react-icons/lu'
import {IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  getActivityDataForStationaryCombustion,
  getActivityDataForSteam
} from '@/lib/api/get'

const IndirectS = () => {
  const [emissionData, setEmissionData] = useState<Record<string, any>>({})
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [fuels, setFuels] = useState<IFuelInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getActivityDataForSteam()
      setFuels(response.data)
    }
    fetchData()
  }, [])

  return (
    <Flex direction="column" justify="space-between" gap={6} mb={8}>
      {/* 고정연소 배출산식식 */}
      <Card.Root
        display="flex"
        flexDirection="column"
        bg="white"
        p={4}
        w="100%"
        borderRadius="lg"
        boxShadow="sm">
        <Card.Title>
          <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
            계산식
          </Text>
        </Card.Title>
        <Card.Body>
          <Text mb={3} fontWeight="medium">
            온실가스 배출량(tCO2eq) = ∑(사용량 × 순발열량 × 전력 간접배출계수 × 온실가스
            등가계수)
          </Text>

          <Text fontSize="sm" color="gray.600" mb={2}>
            *온실가스(CO₂, CH₄, N₂O)별 CO₂ 등가계수 (CO₂ = 1, CH₄ = 21, N₂O = 310)
          </Text>

          <Text fontSize="sm" color="gray.600" mb={2}>
            *A_Type은 열을 발생하는 전용 보일러에서 생산된 열을 공급받아 사용하는 경우
          </Text>

          <Text fontSize="sm" color="gray.600" mb={2}>
            *B_Type은 열병합보일러에서 생산되는 열을 공급받아 사용하는 경우
          </Text>

          <Text fontSize="sm" color="gray.600">
            *C_Type은 열전용, 열병합보일러에서 열(스팀)이 생산되며, 생산 및 가동 비율의
            파악이 어려운 경우
          </Text>
        </Card.Body>
      </Card.Root>

      {/* 사업장 정보 카드 */}
      <Card.Root
        display="flex"
        flexDirection="column"
        bg="white"
        p={4}
        borderRadius="lg"
        boxShadow="sm"
        w="100%"
        flexGrow={1}>
        <Card.Title>
          <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
            배출계수
          </Text>
        </Card.Title>
        <Card.Body>
          <Table.Root showColumnBorder>
            {/* Header */}
            <Table.Header fontWeight="bold" bg="gray.100" p={2} borderTopRadius="md">
              <Table.Row>
                <Table.ColumnHeader padding={2} textAlign="center">
                  {' '}
                </Table.ColumnHeader>

                <Table.ColumnHeader padding={2} textAlign="center">
                  A 타입 배출계수
                </Table.ColumnHeader>

                <Table.ColumnHeader padding={2} textAlign="center">
                  B 타입 배출 계수
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  C 타입 배출계수
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* Data Rows */}
              {fuels?.map(fuel => (
                <Table.Row
                  key={fuel.fuel._id}
                  p={2}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  _hover={{bg: 'gray.50'}}>
                  <Table.Cell flex="1" textAlign="center" px={2}>
                    {fuel.fuel.name}
                  </Table.Cell>
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.a_steam ?? '-'}
                  </Table.Cell>
                  {/* CH4 */}
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.b_steam ?? '-'}
                  </Table.Cell>

                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.c_steam ?? '-'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Body>
      </Card.Root>
    </Flex>
  )
}

export default IndirectS
