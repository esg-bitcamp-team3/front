import {IRevenueRecord, IScopeData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Badge, Box, Stat} from '@chakra-ui/react'
import {useState} from 'react'

interface DataProps {
  label: string
  value: number
  previousValue: number
  unit: string
}

const EmissionStat = ({data}: {data: DataProps}) => {
  const {label, value, previousValue, unit} = data
  const percentIncrease = (value / previousValue) * 100
  const percentChange = Math.abs(100 - percentIncrease)
  const isIncrease = percentIncrease > 100

  const changeType = isIncrease ? 'increase' : 'decrease'
  const changeColor = isIncrease ? 'red.500' : 'green.500'

  return (
    <Box p={4} borderRadius="lg" boxShadow="lg">
      <Stat.Root>
        <Stat.Label padding={2}>{label}</Stat.Label>
        <Stat.ValueText alignItems="baseline" justifyContent="space-between" padding={2}>
          {value.toFixed(2)}
          <Stat.ValueUnit>{unit}</Stat.ValueUnit>
        </Stat.ValueText>
        <Badge colorScheme={changeColor}>
          {changeType === 'increase' ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
          {percentChange.toFixed(2)}%
        </Badge>
      </Stat.Root>
    </Box>
  )
}

export {EmissionStat}
