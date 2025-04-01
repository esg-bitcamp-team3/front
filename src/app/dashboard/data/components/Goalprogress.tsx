import {
  AbsoluteCenter,
  Box,
  FormatNumber,
  Progress,
  ProgressCircle,
  Stat
} from '@chakra-ui/react'

interface GoalProgressProps {
  label: string
  value: number //목표
  currentValue: number //현재 총합
}

const GoalProgress = ({props}: {props: GoalProgressProps}) => {
  const {label, value, currentValue} = props

  const goalPercent = value !== 0 ? (currentValue / value) * 100 : 0
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg">
      <Stat.Root maxW="240px">
        <Stat.Label>🎯목표 달성률</Stat.Label>
        <Stat.ValueText color={goalPercent > 100 ? 'red.500' : 'inherit'}>
          {goalPercent.toFixed(2)}
        </Stat.ValueText>
        <Stat.HelpText mb="2">
          Completed {goalPercent.toFixed(2)}% towards the goal
        </Stat.HelpText>
        <Progress.Root defaultValue={goalPercent > 100 ? 100 : goalPercent}>
          <Progress.Track>
            <Progress.Range colorPalette={goalPercent > 100 ? 'red' : 'teal'} />
          </Progress.Track>
        </Progress.Root>
      </Stat.Root>
    </Box>
  )
}

export {GoalProgress}
