'use client'

import {Box, HStack, Portal, Select, VStack, createListCollection} from '@chakra-ui/react'
import {useMemo, useState, useEffect} from 'react'
import {
  getCalculatedMothlyTotal,
  getCalculatedYearlyEmissionOfSubsidiary,
  getStationaryCombustion
} from '@/lib/api/get'
import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo,
  IMothlyData,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {StationTable} from './addDetail/drawComponent/table'
import {ChartforSubsidary} from './addDetail/drawComponent/chart'
import {TotalState} from './addDetail/drawComponent/state'

export const SelectYear = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [value, setValue] = useState<string[]>(['2023'])
  const [data, setData] = useState<IEmissionInfo[] | null>(null)
  const [monthlyTotal, setMonthlyTotal] = useState<IMothlyData>()
  const [yearlyTotal, setYearlyTotal] = useState<IYearlyEmissionData>()

  const year = ['2020', '2021', '2022', '2023', '2024', '2025']

  const pullData = async () => {
    try {
      const response = await getStationaryCombustion(subsidiaryId, value[0])
      setData(response.data)
      console.log(response.data)
    } catch (error) {}
  }

  const pullMothlyTotalData = async () => {
    try {
      const response = await getCalculatedMothlyTotal(subsidiaryId, value[0])
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

  const yearList = useMemo(() => {
    return createListCollection({
      items: year || [],
      itemToString: (item: string) => item,
      itemToValue: (item: string) => item
    })
  }, [])

  useEffect(() => {
    pullData(), pullMothlyTotalData(), pullYearlyTotalData()
  }, [value])

  return (
    <>
      <Select.Root
        collection={yearList}
        width="320px"
        value={value}
        onValueChange={e => setValue(e.value)}>
        <Select.HiddenSelect />
        <Select.Label>연도</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select Year" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {yearList.items.map(framework => (
                <Select.Item item={framework} key={framework}>
                  {framework}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <HStack>
        <Box>{monthlyTotal && <ChartforSubsidary total={monthlyTotal} />}</Box>
        <Box>
          {yearlyTotal && (
            <TotalState total={yearlyTotal} yearChoice={parseInt(value[0])} />
          )}
        </Box>
      </HStack>
      <Box>{data && <StationTable stationData={data} />}</Box>
    </>
  )
}
