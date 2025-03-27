import {IMothlyData, IYearlyEmissionData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Badge, FormatNumber, HStack, Stat, VStack} from '@chakra-ui/react'

export function TotalState({
  total,
  yearChoice
}: {
  total: IYearlyEmissionData
  yearChoice: number
}) {
  const years = Object.keys(total).map(Number)
  const stationary = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].stationary.toFixed(2))])
  )

  const mobile = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].mobile.toFixed(2))])
  )

  const totalForSubsidiary = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].total.toFixed(2))])
  )

  const y: number[] = [2020, 2021, 2022, 2023, 2024, 2025]

  const percentChangeSt = stationary[yearChoice] / stationary[yearChoice - 1]
  const percentChangeMo = mobile[yearChoice] / mobile[yearChoice - 1]

  const isStIncrease = percentChangeSt > 0
  const isMoIncrease = percentChangeMo > 0

  const changeStType = isStIncrease ? 'increase' : 'decrease'
  const changeStColor = isStIncrease ? 'red.500' : 'green.500'

  const changeMoType = isMoIncrease ? 'increase' : 'decrease'
  const changeMoColor = isMoIncrease ? 'red.500' : 'green.500'

  return (
    <VStack>
      {/* Total state */}
      <Stat.Root size="md">
        <Stat.Label fontWeight="bold" color="rgb(206,182,236)">
          총 배출량
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {totalForSubsidiary[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
      </Stat.Root>

      {/* stationary state */}
      <Stat.Root size="md">
        <Stat.Label fontWeight="bold" color="rgb(75, 192, 192)">
          고정연소
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {stationary[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge colorScheme={changeStColor}>
          {changeStType === 'increase' ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
          {percentChangeSt.toFixed(2)}%
        </Badge>
      </Stat.Root>

      {/* mobile state */}
      <Stat.Root size="md">
        <Stat.Label fontWeight="bold" color="#ABE0AD">
          이동연소
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {mobile[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge colorScheme={changeMoColor}>
          {changeMoType === 'increase' ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
          {percentChangeMo.toFixed(2)}%
        </Badge>
      </Stat.Root>
    </VStack>
  )
}
