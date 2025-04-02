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
  previousValue: number
}

const GoalProgress = ({props}: {props: GoalProgressProps}) => {
  const [originalData, setOriginalData] = useState<ICarbonEmissionGoal>()
  const {id, label, currentValue, previousValue} = props

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

  const goal = (previousValue * (originalData?.emissionGoal ?? 0)) / 100
  const current = previousValue - currentValue
  const goalPercent = (current / goal) * 100

  console.log('goal: ', goal)
  console.log('current: ', current)
  console.log('goalPercent: ', goalPercent)
  const excessGoal = current > 0 ? 1 : 0
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg">
      <Stat.Root w="full">
        <Stat.Label>
          {excessGoal ? (
            <>
              <Text fontWeight="bolder" fontSize="md">
                🎯목표 감축률
              </Text>
            </>
          ) : (
            <>
              <Text fontWeight="bolder" fontSize="md">
                ⚠️목표 감축률
              </Text>
            </>
          )}
          {goalPercent ? (
            <UpdateGoalDialog previousValue={previousValue} id={id} />
          ) : (
            <CreateGoalDialog id={id} />
          )}
        </Stat.Label>
        {excessGoal ? (
          <>
            <Stat.ValueText color="inherit">{goalPercent.toFixed(2)}%</Stat.ValueText>
            <Stat.HelpText mb="2">
              목표 감축률 {goalPercent.toFixed(2)}% 달성하였습니다
            </Stat.HelpText>
            <Progress.Root value={goalPercent}>
              <Progress.Track>
                <Progress.Range colorPalette="teal" />
              </Progress.Track>
            </Progress.Root>
          </>
        ) : (
          <>
            <Stat.ValueText color="red">
              {Math.abs(goalPercent).toFixed(2)}%
            </Stat.ValueText>
            <Stat.HelpText mb="2">
              목표 감축률 보다 {Math.abs(goalPercent).toFixed(2)}% 초과입니다
            </Stat.HelpText>
            <Progress.Root value={goalPercent}>
              <Progress.Track>
                <Progress.Range colorPalette="red" />
              </Progress.Track>
            </Progress.Root>
          </>
        )}
      </Stat.Root>
    </Box>
  )
}

export {GoalProgress}
