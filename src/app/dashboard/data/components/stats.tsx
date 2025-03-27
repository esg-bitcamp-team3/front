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
  const percentChange = value / previousValue
  const isIncrease = percentChange > 0

  const changeType = isIncrease ? 'increase' : 'decrease'
  const changeColor = isIncrease ? 'red.500' : 'green.500'

  const formatNumber = (num: number) => {
    if (Math.abs(num) < 0.001) {
      return num.toExponential(2)
    }
    return num.toLocaleString(undefined, {maximumFractionDigits: 2})
  }

  const formattedValue = formatNumber(value)

  return (
    <Box p={4} borderRadius="lg" boxShadow="sm">
      <Stat.Root>
        <Stat.Label>{label}</Stat.Label>
        <Stat.ValueText>{formattedValue}</Stat.ValueText>
        <Stat.ValueUnit>{unit}</Stat.ValueUnit>
        <Badge colorScheme={changeColor}>
          {changeType === 'increase' ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
          {percentChange.toFixed(2)}%
        </Badge>
      </Stat.Root>
    </Box>
  )
}

export {EmissionStat}
