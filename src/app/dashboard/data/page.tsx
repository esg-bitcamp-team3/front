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
  IMonthlyEmissionData,
  IOrganization,
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
  getCarbonEmissionGoalsOfOrganiation
} from '@/lib/api/get'
import {toaster} from '@/components/ui/toaster'
import {EmissionStat} from './components/stats'
import {EmissionBar} from './components/bar'
import {GoalProgress} from './components/Goalprogress'

// Define prop types for components
interface StatsSectionProps {
  currentYearEmissions: IScopeData | undefined
  previousYearEmissions: IScopeData | undefined
  currentYearMonthlyEmissions: IMonthlyEmissionData | undefined
  previousYearMonthlyEmissions: IMonthlyEmissionData | undefined
  organizationRevenueRecords: IRevenueRecord[] | undefined
  year: number
  month: number
  isLoading: boolean
}

interface ScopeBoxSectionProps {
  currentYearEmissions: IScopeData | undefined
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

  return (
    <SimpleGrid width="full" columns={3} gap={4}>
      {/* 연간 매출당 배출량 */}
      <EmissionStat
        data={{
          label: '연간 매출당 배출량',
          value:
            currentYearEmissions.scope1 /
            (organizationRevenueRecords.find(record => record.year === year)?.revenue ||
              1),
          previousValue:
            previousYearEmissions.scope1 /
            (organizationRevenueRecords.find(record => record.year === year - 1)
              ?.revenue || 1),
          unit: 'gCO2/원'
        }}
      />
      {/* 총 배출량 */}
      <EmissionStat
        data={{
          label: '총 배출량',
          value: currentYearEmissions.scope1,
          previousValue: previousYearEmissions.scope1,
          unit: 'tCO2e'
        }}
      />
      {/* 해당 월 배출량 */}
      <EmissionStat
        data={{
          label: `${month}월 배출량`,
          value: currentYearMonthlyEmissions.stationary[month - 1],
          previousValue: previousYearMonthlyEmissions.stationary[month - 1],
          unit: 'tCO2e'
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

  return <ScopeBox data={currentYearEmissions} />
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
  const [currentYearEmissions, setCurrentYearEmissions] = useState<IScopeData>()
  const [previousYearEmissions, setPreviousYearEmissions] = useState<IScopeData>()
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
  const year = 2023
  const month = 3

  const fetchOrganization = async () => {
    setIsOrganizationLoading(true)
    try {
      const response = await getMyOrganizations()
      setCurrentOrganization(response.data.organization.organization)
      setSubsidiaryList(response.data.subsidiaries)
      setOrganizationRevenueRecords(response.data.organization.revenueRecords)
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

      setCurrentYearEmissions(currentYearEmissionData.data)
      setPreviousYearEmissions(previousYearEmissionData.data)
      setIsScopeLoading(false)

      // Fetch monthly data for stats section
      const [currentYearMonthlyEmissionData, previousYearMonthlyEmissionData] =
        await Promise.all([
          getCalculatedMonthlyEmissionOfOrganiation({id: id, year: year.toString()}),
          getCalculatedMonthlyEmissionOfOrganiation({id: id, year: (year - 1).toString()})
        ])

      setCurrentYearMonthlyEmissions(currentYearMonthlyEmissionData.data)
      setPreviousYearMonthlyEmissions(previousYearMonthlyEmissionData.data)
      setIsStatsLoading(false)

      // Fetch historical data (for emission bar)
      const [yearlyEmissionData] = await Promise.all([
        getCalculatedYearlyEmissionOfOrganiation(id)
      ])

      setHistoricalYearlyEmissions(yearlyEmissionData.data)

      const [yearlyCarbonEmissionGoalData] = await Promise.all([
        getCarbonEmissionGoalsOfOrganiation({id: id})
      ])

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

  return (
    <div>
      <h1>Dashboard</h1>
      {/* 목표 달성 */}
      <GoalProgress props={{label: '목표 달성', value: 100, currentValue: 50}} />

      {/* Each section handles its own loading state */}
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

      <SimpleGrid width="full" columns={2} alignItems="flex-end" gap={4} mt={6}>
        <GridItem>
          <ScopeBoxSection
            currentYearEmissions={currentYearEmissions}
            isLoading={isScopeLoading}
          />
        </GridItem>
        <GridItem>
          <EmissionBarSection
            historicalYearlyEmissions={historicalYearlyEmissions}
            isLoading={isHistoricalDataLoading}
          />
        </GridItem>
      </SimpleGrid>
    </div>
  )
}

export default Page
