import {createListCollection, Portal, Select} from '@chakra-ui/react'
import {useMemo} from 'react'

interface YearSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

const YearSelector = ({props}: {props: YearSelectorProps}) => {
  const {value, onValueChange} = props
  const year = ['2020', '2021', '2022', '2023', '2024', '2025']
  const yearList = useMemo(() => {
    return createListCollection({
      items: year || [],
      itemToString: (item: string) => item,
      itemToValue: (item: string) => item
    })
  }, [])

  return (
    <Select.Root
      collection={yearList}
      width="320px"
      value={[value]}
      onValueChange={e => onValueChange(e.value[0])}>
      <Select.HiddenSelect />
      <Select.Label>선택 연도</Select.Label>
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
            {yearList.items.map(year => (
              <Select.Item item={year} key={year}>
                {year}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

export {YearSelector}
