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
            <text font-Size="1px">
              *A_Type은 열을 발생하는 전용 보일러에서 생산된 열을 공급받아 사용하는 경우를
              말함
            </text>
            <br />
            <text font-Size="1px">
              *B_Type은 열병합보일러에서 생산되는 열을 공급받아 사용하는 경우를 말함{' '}
            </text>
            <br />
            <text font-Size="1px">
              *C_Type은 열전용,열병합보일러에서 열(스팀)이 생산되며,생산 및 가동 비율의
              파익이 어려운 경우를 말함{' '}
            </text>
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

                <Box flex="1">A_Type</Box>
                <Box flex="1">B_Type</Box>
                <Box flex="1">C_Type </Box>
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

                  <Box flex="1">{fuel.emissionFactor?.a_steam || '-'}</Box>
                  <Box flex="1">{fuel.emissionFactor?.b_steam || '-'}</Box>
                  <Box flex="1">{fuel.emissionFactor?.c_steam || '-'}</Box>
                </Flex>
              ))}
            </Box>
          </Card.Body>
        </Card.Root>
      </Flex>
    </>
  )
}

export default IndirectS
