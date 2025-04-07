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

  const electric = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].electric.toFixed(2))])
  )

  const steam = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].steam.toFixed(2))])
  )

  const totalForSubsidiary = Object.fromEntries(
    years.map(year => [year, parseFloat(total[year].total.toFixed(2))])
  )

  const y: number[] = [2020, 2021, 2022, 2023, 2024, 2025]

  const percentChangeTotal =
    totalForSubsidiary[yearChoice] / totalForSubsidiary[yearChoice - 1]
  const percentChangeStationary = stationary[yearChoice] / stationary[yearChoice - 1]
  const percentChangeMobile = mobile[yearChoice] / mobile[yearChoice - 1]
  const percentChangeElectric = electric[yearChoice] / electric[yearChoice - 1]
  const percentChangeSteam = steam[yearChoice] / steam[yearChoice - 1]

  const isTotalIncrease = percentChangeTotal > 0
  const isStationaryIncrease = percentChangeSteam > 0
  const isMobileIncrease = percentChangeMobile > 0
  const isElectricIncrease = percentChangeElectric > 0
  const isSteamIncrease = percentChangeSteam > 0

  const changeTotalType = isTotalIncrease ? 'increase' : 'decrease'
  const changeTotalColor = isTotalIncrease ? 'red.500' : 'green.500'

  const changeStationaryType = isStationaryIncrease ? 'increase' : 'decrease'
  const changeStationaryColor = isStationaryIncrease ? 'red.500' : 'green.500'

  const changeMobileType = isMobileIncrease ? 'increase' : 'decrease'
  const changeMobileColor = isMobileIncrease ? 'red.500' : 'green.500'

  const changeElectricType = isElectricIncrease ? 'increase' : 'decrease'
  const changeElectricColor = isElectricIncrease ? 'red.500' : 'green.500'

  const changeSteamType = isSteamIncrease ? 'increase' : 'decrease'
  const changeSteamColor = isSteamIncrease ? 'red.500' : 'green.500'

  return (
    <HStack spaceX={20}>
      {/* Total state */}
      <Stat.Root size="lg">
        <Stat.Label fontWeight="bold" color="rgb(206,182,236)">
          총 배출량
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {totalForSubsidiary[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge>
          {changeTotalType === 'increase' ? (
            <Stat.UpIndicator color={changeTotalColor} />
          ) : (
            <Stat.DownIndicator color={changeTotalColor} />
          )}
          {percentChangeTotal.toFixed(2)}%
        </Badge>
      </Stat.Root>

      {/* stationary state */}
      <Stat.Root size="lg">
        <Stat.Label fontWeight="bold" color="rgb(75, 192, 192)">
          고정연소
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {stationary[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge>
          {changeStationaryType === 'increase' ? (
            <Stat.UpIndicator color={changeStationaryColor} />
          ) : (
            <Stat.DownIndicator color={changeStationaryColor} />
          )}
          {percentChangeStationary.toFixed(2)}%
        </Badge>
      </Stat.Root>

      {/* mobile state */}
      <Stat.Root size="lg">
        <Stat.Label fontWeight="bold" color="#ABE0AD">
          이동연소
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {mobile[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge>
          {changeMobileType === 'increase' ? (
            <Stat.UpIndicator color={changeMobileColor} />
          ) : (
            <Stat.DownIndicator color={changeMobileColor} />
          )}
          {percentChangeMobile.toFixed(2)}%
        </Badge>
      </Stat.Root>

      {/* electric state */}
      <Stat.Root size="lg">
        <Stat.Label fontWeight="bold" color="#a3b43e">
          간접연소(전기)
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {electric[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge>
          {changeElectricType === 'increase' ? (
            <Stat.UpIndicator color={changeElectricColor} />
          ) : (
            <Stat.DownIndicator color={changeElectricColor} />
          )}
          {percentChangeElectric.toFixed(2)}%
        </Badge>
      </Stat.Root>

      {/* steam state */}
      <Stat.Root size="lg">
        <Stat.Label fontWeight="bold" color="#3d4a3d">
          간접연소(스팀)
        </Stat.Label>
        <Stat.ValueText alignItems="baseline">
          {steam[yearChoice]}
          <Stat.ValueUnit>tCO2eq</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge>
          {changeSteamType === 'increase' ? (
            <Stat.UpIndicator color={changeSteamColor} />
          ) : (
            <Stat.DownIndicator color={changeSteamColor} />
          )}
          {percentChangeSteam.toFixed(2)}%
        </Badge>
      </Stat.Root>
    </HStack>
  )
}
