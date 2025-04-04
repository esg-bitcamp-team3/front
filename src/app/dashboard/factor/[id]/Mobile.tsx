'use client'

import {useEffect, useState} from 'react'
import {Box, Flex, Text, HStack, DataList, Card, Table} from '@chakra-ui/react'
import {LuArrowUp, LuArrowDown} from 'react-icons/lu'
import {IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  getActivityDataForMobileCombustion,
  getActivityDataForStationaryCombustion
} from '@/lib/api/get'

const Mobile = () => {
  const [emissionData, setEmissionData] = useState<Record<string, any>>({})
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [fuels, setFuels] = useState<IFuelInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getActivityDataForMobileCombustion()
      setFuels(response.data)
    }
    fetchData()
  }, [])

  return (
    <Flex direction="column" justify="space-between" gap={6} mb={8}>
      {/* 이동연소 배출산식식 */}
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
            온실가스 배출량(tCO2eq) = ∑(사용량 × 순발열량 × 온실가스별 배출계수 × 산화계수
            × 온실가스 등가계수 × 10^-9)
          </Text>

          <Text fontSize="sm" color="gray.600" mb={2}>
            *온실가스(CO₂, CH₄, N₂O)별 CO₂ 등가계수 (CO₂ = 1, CH₄ = 21, N₂O = 310)
          </Text>

          <Text fontSize="sm" color="gray.600">
            *산화계수 = 1
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
                  연료
                </Table.ColumnHeader>

                <Table.ColumnHeader padding={2} textAlign="center">
                  EF-CO2
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  EF-CH4
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  EF-N2O
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
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.fuel.name}
                  </Table.Cell>
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.efCO2_mobile ?? '-'}
                  </Table.Cell>
                  {/* CH4 */}
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.efCH4_mobile ?? '-'}
                  </Table.Cell>

                  <Table.Cell flex="1" textAlign="center">
                    {fuel.emissionFactor?.efN2O_mobile ?? '-'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Body>
      </Card.Root>
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
            발열량
          </Text>
        </Card.Title>
        <Card.Body>
          <Table.Root showColumnBorder>
            {/* Header */}
            <Table.Header fontWeight="bold" bg="gray.100" p={2} borderTopRadius="md">
              <Table.Row>
                <Table.ColumnHeader padding={2} textAlign="center">
                  연료 코드
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  연료
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  단위
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  총발열량 GCV
                </Table.ColumnHeader>
                <Table.ColumnHeader padding={2} textAlign="center">
                  순발열량 NCV
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
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.fuel.code}
                  </Table.Cell>
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.fuel.name ?? '-'}
                  </Table.Cell>
                  {/* 단위 */}
                  <Table.Cell flex="1" textAlign="center">
                    {fuel.calorificValue?.gcbUnit ?? fuel.calorificValue?.ncvUnit ?? '-'}
                  </Table.Cell>

                  <Table.Cell flex="1" textAlign="center">
                    {fuel.calorificValue?.gcv ?? '-'}
                  </Table.Cell>

                  <Table.Cell flex="1" textAlign="center">
                    {fuel.calorificValue?.ncv ?? '-'}
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

export default Mobile
