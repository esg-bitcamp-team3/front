import {createListCollection, Portal, Select} from '@chakra-ui/react'
import {useMemo} from 'react'

interface SelectorProps {
  value: string
  onValueChange: (value: string) => void
}

const TypeSelector = ({props}: {props: SelectorProps}) => {
  const {value, onValueChange} = props
  const dataType = ['station', 'mobile']
  const list = useMemo(() => {
    return createListCollection({
      items: dataType || [],
      itemToString: (item: string) => item,
      itemToValue: (item: string) => item
    })
  }, [])

  return (
    <Select.Root
      collection={list}
      width="320px"
      value={[value]}
      onValueChange={e => onValueChange(e.value[0])}>
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select Year" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {list.items.map(data => (
              <Select.Item item={data} key={data}>
                {data}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

export {TypeSelector}
