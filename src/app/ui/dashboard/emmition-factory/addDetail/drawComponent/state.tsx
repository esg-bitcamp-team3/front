import {IMothlyData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Badge, FormatNumber, HStack, Stat} from '@chakra-ui/react'

export function TotalState({total}: {total: IMothlyData}) {
  const stationData = total.stationary || []
  const mobileData = total.mobile || []

  return (
    <Stat.Root>
      <Stat.Label>Unique </Stat.Label>
      <Stat.ValueText>
        <FormatNumber value={8456.4} style="currency" currency="USD" />
      </Stat.ValueText>
      <Badge colorPalette="green" gap="0">
        <Stat.UpIndicator />
        12%
      </Badge>
      <Stat.HelpText>since last month</Stat.HelpText>
    </Stat.Root>
  )
}
