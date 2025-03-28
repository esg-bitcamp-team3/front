'use client'

import {Box, HStack} from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import {
  getCalculatedMothlyTotal,
  getCalculatedYearlyEmissionOfSubsidiary,
  getStationaryCombustion
} from '@/lib/api/get'
import {
  IEmissionInfo,
  IMothlyData,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {ChartforSubsidary} from './addDetail/drawComponent/chart'
import {TotalState} from './addDetail/drawComponent/state'

interface yearAndSubs {
  subsidiaryId: string
  year: string
}

export const SelectYear = ({props}: {props: yearAndSubs}) => {
  const {subsidiaryId, year} = props
  const [data, setData] = useState<IEmissionInfo[] | null>(null)
  const [monthlyTotal, setMonthlyTotal] = useState<IMothlyData>()
  const [yearlyTotal, setYearlyTotal] = useState<IYearlyEmissionData>()

  const pullData = async () => {
    try {
      const response = await getStationaryCombustion(subsidiaryId, year)
      setData(response.data)
      console.log(response.data)
    } catch (error) {}
  }

  const pullMothlyTotalData = async () => {
    try {
      const response = await getCalculatedMothlyTotal(subsidiaryId, year)
      setMonthlyTotal(response.data)
      console.log(response.data)
    } catch (error) {}
  }

  const pullYearlyTotalData = async () => {
    try {
      const response = await getCalculatedYearlyEmissionOfSubsidiary(subsidiaryId)
      setYearlyTotal(response.data)
      console.log('year', response.data)
    } catch (error) {}
  }

  useEffect(() => {
    pullData(), pullMothlyTotalData(), pullYearlyTotalData()
  }, [year])

  return (
    <>
      <HStack>
        <Box>{monthlyTotal && <ChartforSubsidary total={monthlyTotal} />}</Box>
        <Box>
          {yearlyTotal && <TotalState total={yearlyTotal} yearChoice={parseInt(year)} />}
        </Box>
      </HStack>
    </>
  )
}
