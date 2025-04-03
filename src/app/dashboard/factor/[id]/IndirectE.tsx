'use client'

import {useEffect, useState} from 'react'
import {Box, Flex, Text, HStack, DataList, Card, Table} from '@chakra-ui/react'
import {LuArrowUp, LuArrowDown} from 'react-icons/lu'
import {IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  getActivityDataForElectricity,
  getActivityDataForStationaryCombustion
} from '@/lib/api/get'

const IndirectE = () => {
  const [emissionData, setEmissionData] = useState<Record<string, any>>({})
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [fuels, setFuels] = useState<IFuelInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getActivityDataForElectricity()
      setFuels(response.data)
    }
    fetchData()
  }, [])

  return (
    <>
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bolder">
          고정연소
        </Text>
      </Flex>
      <br />
      <Flex direction="row" justify="space-between" gap={6} mb={8}>
        {/* 고정연소 배출산식식 */}
        <Card.Root
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          w="4xl"
          borderRadius="lg"
          boxShadow="sm">
          <Card.Title>
            <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
              계산식
            </Text>
          </Card.Title>
          <Card.Body>
            온실가스 배출량(tCO2eq) = ∑(사용량 x 순발열량 x 전력 간접배출계수 x 온실가스
            등가계수)
            <br /> <br />
            <text font-Size="1px">
              *온실가스(CO₂, CH₄, N₂O)별 CO₂ 등가계수 (CO₂ = 1, CH₄ = 21, N₂O = 310){' '}
            </text>
            <br />
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
          w="48%"
          flexGrow={1}>
          <Card.Title>
            <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
              배출계수 & 순발열량
            </Text>
          </Card.Title>
          <Card.Body>
            <Box overflowY="auto" maxHeight="500px" pr={2}>
              {/* Header */}
              <Flex fontWeight="bold" bg="gray.100" p={2} borderTopRadius="md">
                <Box flex="1">연료명</Box>

                <Box flex="1">CO₂ 배출계수 (공통)</Box>
                <Box flex="1">CH4 배출계수 (공통)</Box>
                <Box flex="1">N20 배출계수 (공통)</Box>
              </Flex>

              {/* Data Rows */}
              {fuels?.map(fuel => (
                <Flex
                  key={fuel.fuel._id}
                  p={2}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  _hover={{bg: 'gray.50'}}>
                  <Box flex="1">{fuel.fuel.name}</Box>
                  <Box flex="1">{fuel.emissionFactor?.efCO2_electric || '-'}</Box>
                  <Box flex="1">{fuel.emissionFactor?.efCH4_electric || '-'}</Box>
                  <Box flex="1">{fuel.emissionFactor?.efN2O_electric || '-'}</Box>
                </Flex>
              ))}
            </Box>
          </Card.Body>
        </Card.Root>
      </Flex>
    </>
  )
}

export default IndirectE
