import {DataList} from '@chakra-ui/react'

export default function Page() {
  return (
    <DataList.Root>
      {data.map(item => (
        <DataList.Item key={item.label}>
          <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
          <DataList.ItemValue>{item.value}</DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  )
}
