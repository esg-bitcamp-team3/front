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
      size="sm"
      collection={yearList}
      width="320px"
      value={[value]}
      onValueChange={e => onValueChange(e.value[0])}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText padding={2} placeholder="연도를 선택하세요" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {yearList.items.map(year => (
              <Select.Item padding={2} item={year} key={year}>
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
