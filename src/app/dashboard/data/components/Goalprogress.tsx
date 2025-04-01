import {
  AbsoluteCenter,
  Box,
  Button,
  FormatNumber,
  Progress,
  ProgressCircle,
  Stat,
  Text,
  Icon
} from '@chakra-ui/react'
import {UpdateGoalDialog} from './updateGoaldialog'
import {CreateGoalDialog} from './createGoalDialog'
import {ICarbonEmissionGoal} from '@/lib/api/interfaces/retrieveInterfaces'
import {useEffect, useState} from 'react'
import {getCarbonEmissionGoalsOfOrganization} from '@/lib/api/get'

interface GoalProgressProps {
  id: string
  label: string
  currentValue: number //현재 총합
}

const GoalProgress = ({props}: {props: GoalProgressProps}) => {
  const [originalData, setOriginalData] = useState<ICarbonEmissionGoal>()
  const {id, label, currentValue} = props

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCarbonEmissionGoalsOfOrganization({id})
        const fetchedData = response.data['2025']
        setOriginalData(fetchedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const value = originalData?.emissionGoal

  console.log('currentValue: ', currentValue)
  console.log('value: ', value)
  const goalPercent = value !== 0 ? (currentValue / (value ?? 1)) * 100 : 0

  return (
    <Box p={4} borderRadius="lg" boxShadow="lg">
      <Stat.Root minW="250px">
        <Stat.Label>
          <Text fontWeight="bolder" fontSize="md">
            ⚠️상한값 접근수준
          </Text>
          {value ? <UpdateGoalDialog id={id} /> : <CreateGoalDialog id={id} />}
        </Stat.Label>
        <Stat.ValueText color={goalPercent > 100 ? 'red.500' : 'inherit'}>
          {goalPercent.toFixed(2)}%
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
