'use client'

import SubsidiaryDetail from '@/app/ui/dashboard/emmition-factory/tabs'
import {Box, Tabs, Text} from '@chakra-ui/react'
import {ReactNode, useState} from 'react'
import {LuFolder, LuSettings, LuSquareCheck} from 'react-icons/lu'
import SubsidiaryDetailData from '../[id]/SubsidiaryDetail'

interface TabContentProps {
  value: string
  children: ReactNode
}

function TabContent({value, children}: TabContentProps) {
  return (
    <Box pos="relative" py={2} height="100%">
      <Tabs.Content
        value={value}
        position="relative"
        _open={{
          animationName: 'fade-in, scale-in',
          animationDuration: '300ms'
        }}
        _closed={{
          animationName: 'fade-out, scale-out',
          animationDuration: '120ms'
        }}
        height="100%">
        {children}
      </Tabs.Content>
    </Box>
  )
}

interface TabTriggerProps {
  icon: ReactNode
  value: string
  label: string
}

function TabTrigger({icon, value, label}: TabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      gap={2}
      fontSize="sm"
      fontWeight="semibold"
      _selected={{
        color: 'blue.500',
        borderColor: 'blue.500',
        fontWeight: 'bold'
      }}>
      {icon}
      {label}
    </Tabs.Trigger>
  )
}

const SubsidiaryTab = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [tab, setTab] = useState('detail')
  return (
    <Box borderBottom="1px">
      <Tabs.Root
        value={tab}
        onValueChange={e => setTab(e.value)}
        px={6}
        variant="line"
        colorPalette="blue"
        lazyMount
        unmountOnExit>
        <Tabs.List gap={4}>
          <TabTrigger value="detail" label="Detail" icon={<LuFolder />} />
          <TabTrigger value="graph" label="Graph" icon={<LuFolder />} />
          <TabTrigger value="data" label="Data" icon={<LuSquareCheck />} />
          <TabTrigger value="settings" label="Settings" icon={<LuSettings />} />
        </Tabs.List>
        <TabContent
          value="detail"
          children={<SubsidiaryDetailData subsidiaryId={subsidiaryId} />}></TabContent>
        <TabContent
          value="graph"
          children={<SubsidiaryDetail subsidiaryId={subsidiaryId} />}></TabContent>
        <TabContent value="data" children={<Text></Text>} />
        <TabContent value="settings" children={<Text>Settings</Text>}></TabContent>
      </Tabs.Root>
    </Box>
  )
}

export default SubsidiaryTab
