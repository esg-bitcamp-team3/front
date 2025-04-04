'use client'

import {Box, HStack, VStack} from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import {
  getCalculatedMothlyEmissionOfSubsidiary,
  getCalculatedYearlyEmissionOfSubsidiary,
  getEmissionDataFromStationaryCombustion
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
      const response = await getEmissionDataFromStationaryCombustion({
        id: subsidiaryId,
        year: year
      })
      setData(response.data)
      console.log(response.data)
    } catch (error) {}
  }

  const pullMothlyTotalData = async () => {
    try {
      const response = await getCalculatedMothlyEmissionOfSubsidiary({
        id: subsidiaryId,
        year: year
      })
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
      <VStack display="flex" justifyContent="center" alignItems="center" padding={10}>
        <Box>
          {yearlyTotal && <TotalState total={yearlyTotal} yearChoice={parseInt(year)} />}
        </Box>
        <Box w="10/12" paddingY={20}>
          {monthlyTotal && <ChartforSubsidary total={monthlyTotal} />}
        </Box>
      </VStack>
    </>
  )
}
