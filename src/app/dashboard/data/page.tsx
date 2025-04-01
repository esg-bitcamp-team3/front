'use client'

import {
  Box,
  GridItem,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  Center,
  Spinner
} from '@chakra-ui/react'
import {ScopeChart, ScopeBarChart, ScopeBox} from './components/scopeChart'
import {
  ICarbonEmissionGoalsByYear,
  ILittleOrganization,
  IMonthlyEmissionData,
  IOrganization,
  IOrganizationData,
  IOrganizationRevenueByYear,
  IRevenueRecord,
  IScopeData,
  ISubsidiary,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {useEffect, useState, Suspense} from 'react'
import {getMyOrganizations} from '@/lib/api/my'
import {
  getCalculatedEmissionOfOrganiation,
  getCalculatedMonthlyEmissionOfOrganiation,
  getCalculatedYearlyEmissionOfOrganiation,
  getCarbonEmissionGoalsOfOrganization,
  getOrganizaionRevenueByYear
} from '@/lib/api/get'
import {toaster} from '@/components/ui/toaster'
import {EmissionStat} from './components/stats'
import {EmissionBar} from './components/bar'
import {OrganizationCard} from './components/orgainzationCard'
import {GoalProgress} from './components/Goalprogress'
import {PieForOrganization} from './components/pie'

// Define prop types for components
interface StatsSectionProps {
  currentYearEmissions: IOrganizationData | undefined
  previousYearEmissions: IOrganizationData | undefined
  currentYearMonthlyEmissions: IMonthlyEmissionData | undefined
  previousYearMonthlyEmissions: IMonthlyEmissionData | undefined
  organizationRevenueRecords: IOrganizationRevenueByYear | undefined
  year: number
  month: number
  isLoading: boolean
}

interface ScopeBoxSectionProps {
  currentYearEmissions: IOrganizationData | undefined
  isLoading: boolean
}

interface EmissionBarSectionProps {
  historicalYearlyEmissions: IYearlyEmissionData | undefined
  isLoading: boolean
}

// Fallback components for each section
const StatsFallback = () => (
  <SimpleGrid width="full" columns={3} gap={4}>
    {[1, 2, 3].map(i => (
      <Box key={i} p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <SkeletonText mt="4" noOfLines={2} gap="4" />
        <Skeleton height="20px" mt={4} />
      </Box>
    ))}
  </SimpleGrid>
)

const ScopeBoxFallback = () => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" height="300px">
    <SkeletonText mt="4" noOfLines={2} gap="4" />
    <Skeleton height="200px" mt={4} />
  </Box>
)

const EmissionBarFallback = () => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" height="300px">
    <SkeletonText mt="4" noOfLines={2} gap="4" />
    <Skeleton height="200px" mt={4} />
  </Box>
)

// Stats component with typed props and fallback
const StatsSection: React.FC<StatsSectionProps> = ({
  currentYearEmissions,
  previousYearEmissions,
  currentYearMonthlyEmissions,
  previousYearMonthlyEmissions,
  organizationRevenueRecords,
  year,
  month,
  isLoading
}) => {
  console.log('???', organizationRevenueRecords)
  if (
    isLoading ||
    !currentYearEmissions ||
    !previousYearEmissions ||
    !currentYearMonthlyEmissions ||
    !previousYearMonthlyEmissions ||
    !organizationRevenueRecords
  ) {
    return <StatsFallback />
  }

  // console.log(currentYearEmissions)

  if (!organizationRevenueRecords[year] || !organizationRevenueRecords[year - 1]) {
    return null
  }

  return (
    <SimpleGrid width="full" columns={3} gap={4}>
      {/* 연간 매출당 배출량 */}
      <EmissionStat
        data={{
          label: '연간 매출당 배출량',
          value:
            (100000000 * currentYearEmissions.stationary) /
            (organizationRevenueRecords[year].revenue || 1),
          previousValue:
            (100000000 * previousYearEmissions.stationary) /
            (organizationRevenueRecords[year - 1].revenue || 1),
          unit: 'tCO2eq/억원'
        }}
      />
      {/* 총 배출량 */}
      <EmissionStat
        data={{
          label: '총 배출량',
          value: currentYearEmissions.stationary,
          previousValue: previousYearEmissions.stationary,
          unit: 'tCO2eq'
        }}
      />
      {/* 해당 월 배출량 */}
      <EmissionStat
        data={{
          label: `${month}월 배출량`,
          value: currentYearMonthlyEmissions.stationary[month - 1],
          previousValue: previousYearMonthlyEmissions.stationary[month - 1],
          unit: 'tCO2eq'
        }}
      />
    </SimpleGrid>
  )
}

// Scope box component with typed props and fallback
const ScopeBoxSection: React.FC<ScopeBoxSectionProps> = ({
  currentYearEmissions,
  isLoading
}) => {
  if (isLoading || !currentYearEmissions) {
    return <ScopeBoxFallback />
  }
  return <PieForOrganization datas={currentYearEmissions} />
}

// Emission bar component with typed props and fallback
const EmissionBarSection: React.FC<EmissionBarSectionProps> = ({
  historicalYearlyEmissions,
  isLoading
}) => {
  if (isLoading || !historicalYearlyEmissions) {
    return <EmissionBarFallback />
  }

  return <EmissionBar data={historicalYearlyEmissions} />
}

const Page = () => {
  const [currentOrganization, setCurrentOrganization] = useState<IOrganization>()
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>()
  const [organizationRevenueRecords, setOrganizationRevenueRecords] =
    useState<IRevenueRecord[]>()
  const [currentYearEmissions, setCurrentYearEmissions] = useState<IOrganizationData>()
  const [previousYearEmissions, setPreviousYearEmissions] = useState<IOrganizationData>()
  const [currentYearMonthlyEmissions, setCurrentYearMonthlyEmissions] =
    useState<IMonthlyEmissionData>()
  const [previousYearMonthlyEmissions, setPreviousYearMonthlyEmissions] =
    useState<IMonthlyEmissionData>()
  const [historicalYearlyEmissions, setHistoricalYearlyEmissions] =
    useState<IYearlyEmissionData>()
  const [emissionGoalsByYear, setEmissionGoalsByYear] =
    useState<ICarbonEmissionGoalsByYear>()

  // Add separate loading states for each component
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [isScopeLoading, setIsScopeLoading] = useState(true)
  const [isHistoricalDataLoading, setIsHistoricalDataLoading] = useState(true)

  const today = new Date()
  const year = 2022
  const month = 3

  const fetchOrganization = async () => {
    setIsOrganizationLoading(true)
    try {
      const response = await getMyOrganizations()
      console.log('asdfsdf', response.data.organization)
      setCurrentOrganization(response.data.organization)
      setSubsidiaryList(response.data.subsidiaries)
    } catch (error) {
      toaster.error({
        title: '기업 데이터를 가져오는 데 실패했습니다.'
      })
    } finally {
      setIsOrganizationLoading(false)
    }
  }

  const fetchData = async (id: string, year: number) => {
    // Set all component loading states to true
    setIsStatsLoading(true)
    setIsScopeLoading(true)
    setIsHistoricalDataLoading(true)

    try {
      // Fetch current and previous year emissions (for stats and scope sections)
      const [currentYearEmissionData, previousYearEmissionData] = await Promise.all([
        getCalculatedEmissionOfOrganiation({id: id, year: year.toString()}),
        getCalculatedEmissionOfOrganiation({id: id, year: (year - 1).toString()})
      ])
      console.log('currenasdgsgt', currentYearEmissionData.data)
      console.log('previoust', previousYearEmissionData.data)

      setCurrentYearEmissions(currentYearEmissionData.data)
      setPreviousYearEmissions(previousYearEmissionData.data)
      setIsScopeLoading(false)

      // Fetch monthly data for stats section
      const [
        currentYearMonthlyEmissionData,
        previousYearMonthlyEmissionData,
        organizationRevenueRecordsByYear
      ] = await Promise.all([
        getCalculatedMonthlyEmissionOfOrganiation({id: id, year: year.toString()}),
        getCalculatedMonthlyEmissionOfOrganiation({id: id, year: (year - 1).toString()}),
        getOrganizaionRevenueByYear({id: id})
      ])

      console.log('current', currentYearMonthlyEmissionData.data)
      console.log('prev', previousYearMonthlyEmissionData.data)

      setCurrentYearMonthlyEmissions(currentYearMonthlyEmissionData.data)
      setPreviousYearMonthlyEmissions(previousYearMonthlyEmissionData.data)
      setOrganizationRevenueRecords(organizationRevenueRecordsByYear.data)
      console.log('asdfasdfa', organizationRevenueRecordsByYear)
      console.log(id)

      setIsStatsLoading(false)

      // Fetch historical data (for emission bar)
      const [yearlyEmissionData] = await Promise.all([
        getCalculatedYearlyEmissionOfOrganiation(id)
      ])

      setHistoricalYearlyEmissions(yearlyEmissionData.data)

      const [yearlyCarbonEmissionGoalData] = await Promise.all([
        getCarbonEmissionGoalsOfOrganization({id: id})
      ])
      console.log('year', yearlyEmissionData.data)
      console.log('goal', yearlyCarbonEmissionGoalData.data)

      setEmissionGoalsByYear(yearlyCarbonEmissionGoalData.data)

      setIsHistoricalDataLoading(false)
    } catch (error) {
      toaster.error({
        title: '데이터를 가져오는 데 실패했습니다.'
      })
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [])

  useEffect(() => {
    if (currentOrganization) {
      fetchData(currentOrganization._id, year)
    }
  }, [currentOrganization, year])

  if (isOrganizationLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
        <Text ml={4}>기업 정보를 불러오는 중입니다...</Text>
      </Center>
    )
  }

  console.log('currentOrganization: ', currentOrganization?.name)
  console.log('currentOrganization: ', currentOrganization?.industryType)
  console.log('currentOrganization: ', currentOrganization?.registrationNumber)

  return (
    <Box padding={6}>
      {/* 기업 이름과 목표 달성 */}
      <HStack spaceY={6} paddingBottom={6} alignItems="center">
        {currentOrganization && <OrganizationCard organization={currentOrganization} />}
        {emissionGoalsByYear && (
          <GoalProgress
            props={{
              label: '목표 달성',
              value: emissionGoalsByYear?.['2025']?.emissionGoal || 0,
              currentValue: currentYearEmissions?.scope1 || 1
            }}
          />
        )}
      </HStack>

      {/* 통계 섹션 */}
      <Box marginBottom={8}>
        <StatsSection
          currentYearEmissions={currentYearEmissions}
          previousYearEmissions={previousYearEmissions}
          currentYearMonthlyEmissions={currentYearMonthlyEmissions}
          previousYearMonthlyEmissions={previousYearMonthlyEmissions}
          organizationRevenueRecords={organizationRevenueRecords}
          year={year}
          month={month}
          isLoading={isStatsLoading}
        />
      </Box>

      {/* 그래프 섹션 */}
      <SimpleGrid columns={{base: 1, md: 2}} spaceY={1} paddingX="80px">
        <Box>
          <ScopeBoxSection
            currentYearEmissions={currentYearEmissions}
            isLoading={isScopeLoading}
          />
        </Box>
        <Box>
          <EmissionBarSection
            historicalYearlyEmissions={historicalYearlyEmissions}
            isLoading={isHistoricalDataLoading}
          />
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default Page
