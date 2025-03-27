'use client'

import {Box, GridItem, HStack, SimpleGrid} from '@chakra-ui/react'
import {ScopeChart, ScopeBarChart, ScopeBox} from './components/scopeChart'
import {
  IMonthlyEmissionData,
  IOrganization,
  IRevenueRecord,
  IScopeData,
  ISubsidiary,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {useEffect, useState} from 'react'
import {getMyOrganizations} from '@/lib/api/my'
import {
  getCalculatedEmissionOfOrganiation,
  getCalculatedMonthlyEmissionOfOrganiation,
  getCalculatedYearlyEmissionOfOrganiation
} from '@/lib/api/get'
import {toaster} from '@/components/ui/toaster'
import {EmissionStat} from './components/stats'
import {EmissionBar} from './components/bar'

const Page = () => {
  const [organization, setOrganization] = useState<IOrganization>()
  const [subsidaryList, setSubsidaryList] = useState<ISubsidiary[]>()
  const [revenueRecordList, setRevenueRecordList] = useState<IRevenueRecord[]>()
  const [data, setData] = useState<IScopeData>()
  const [previousData, setPreviousData] = useState<IScopeData>()
  const [monthlyData, setMonthlyData] = useState<IMonthlyEmissionData>()
  const [previousMonthlyData, setPreviousMonthlyData] = useState<IMonthlyEmissionData>()
  const [yearlyData, setYearlyData] = useState<IYearlyEmissionData>()
  const today = new Date()
  const year = 2023
  const month = 3

  const fetchOrgnization = async () => {
    try {
      const response = await getMyOrganizations()
      setOrganization(response.data.organization.organization)
      setSubsidaryList(response.data.subsidiaries)
      setRevenueRecordList(response.data.organization.revenueRecords)
    } catch (error) {
      toaster.error({
        title: '기업 데이터를 가져오는 데 실패했습니다.'
      })
    }
  }

  const fetchData = async (id: string, year: number) => {
    try {
      const result1 = await getCalculatedEmissionOfOrganiation(id, year.toString())
      setData(result1.data)
      const result2 = await getCalculatedEmissionOfOrganiation(id, (year - 1).toString())
      setPreviousData(result2.data)
      const result3 = await getCalculatedMonthlyEmissionOfOrganiation(id, year.toString())
      console.log(result3)
      setMonthlyData(result3.data)
      const result4 = await getCalculatedMonthlyEmissionOfOrganiation(
        id,
        (year - 1).toString()
      )
      setPreviousMonthlyData(result4.data)

      const result5 = await getCalculatedYearlyEmissionOfOrganiation(id)
      setYearlyData(result5.data)
    } catch (error) {
      toaster.error({
        title: '데이터를 가져오는 데 실패했습니다.'
      })
    }
  }

  useEffect(() => {
    fetchOrgnization()
  }, [])

  useEffect(() => {
    if (organization) {
      fetchData(organization._id, year)
    }
  }, [organization, year])

  if (
    !data ||
    !previousData ||
    !monthlyData ||
    !previousMonthlyData ||
    !organization ||
    !revenueRecordList ||
    !yearlyData
  ) {
    console.log('data', data)
    console.log('previousData', previousData)
    console.log('monthlyData', monthlyData)
    console.log('previousMonthlyData', previousMonthlyData)
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <SimpleGrid width="full" columns={3}>
        {/* 연간 매출당 배출량 */}
        <EmissionStat
          data={{
            label: '연간 매출당 배출량',
            value:
              data.scope1 /
              (revenueRecordList.find(record => record.year === year)?.revenue || 1),
            previousValue:
              previousData.scope1 /
              (revenueRecordList.find(record => record.year === year - 1)?.revenue || 1),
            unit: 'gCO2/원'
          }}
        />
        {/* 총 배출량 */}
        <EmissionStat
          data={{
            label: '총 배출량',
            value: data.scope1,
            previousValue: previousData.scope1,
            unit: 'tCO2e'
          }}
        />
        {/* 해당 월 배출량 */}
        <EmissionStat
          data={{
            label: `${month}월 배출량`,
            value: monthlyData.stationary[month - 1],
            previousValue: previousMonthlyData.stationary[month - 1],
            unit: 'tCO2e'
          }}
        />
      </SimpleGrid>
      <SimpleGrid width="full" columns={2} alignItems="flex-end" gap={4}>
        <GridItem>
          <ScopeBox data={data} />
        </GridItem>
        <GridItem>
          <EmissionBar data={yearlyData} />
        </GridItem>
      </SimpleGrid>
    </div>
  )
}

export default Page
