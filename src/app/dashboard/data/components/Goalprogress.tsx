import {AbsoluteCenter, ProgressCircle} from '@chakra-ui/react'

interface GoalProgressProps {
  label: string
  value: number
  currentValue: number
}

const GoalProgress = ({props}: {props: GoalProgressProps}) => {
  const {label, value, currentValue} = props
  return (
    <ProgressCircle.Root
      size="lg"
      value={(currentValue / value) * 100}
      colorPalette="green">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <AbsoluteCenter>
        <ProgressCircle.ValueText>
          {((currentValue / value) * 100).toFixed(2)}%
        </ProgressCircle.ValueText>
      </AbsoluteCenter>
    </ProgressCircle.Root>
  )
}

export {GoalProgress}
