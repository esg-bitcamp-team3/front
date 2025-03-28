import {Tabs} from '@chakra-ui/react'

interface SelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export const SelectTypeTab = ({props}: {props: SelectorProps}) => {
  const {value, onValueChange} = props

  return (
    <Tabs.Root value={value} variant="plain" onValueChange={e => onValueChange(e.value)}>
      <Tabs.List bg="bg.muted" rounded="l3" p="1">
        <Tabs.Trigger value="station" padding={2}>
          고정연소
        </Tabs.Trigger>
        <Tabs.Trigger value="mobile" padding={2}>
          이동연소
        </Tabs.Trigger>
        <Tabs.Indicator rounded="l2" borderRadius={12} />
      </Tabs.List>
    </Tabs.Root>
  )
}
