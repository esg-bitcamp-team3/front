'use client'

import {Box, Flex, Tabs, Text} from '@chakra-ui/react'
import {ReactNode, useEffect, useState} from 'react'
import {LuFolder, LuSettings, LuSquareCheck} from 'react-icons/lu'

import {toaster} from '@/components/ui/toaster'
import {getSubsidiaryById} from '@/lib/api/get'
import SubsidiaryDetailData from '../../emmition-factory/[id]/SubsidiaryDetail'
import Stationary from '../[id]/Stationary'
import Mobile from '../[id]/Mobile'
import IndirectE from '../[id]/IndirectE'
import IndirectS from '../[id]/IndirectS'

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
  const [tab, setTab] = useState('Stationary') // ✅ 하나만 필요

  return (
    <Box borderBottom="1px">
      <Flex justify="space-between" align="center" pt={5} pl={10}></Flex>
      <br />
      <Tabs.Root
        value={tab}
        px={6}
        variant="line"
        colorPalette="blue"
        lazyMount
        onValueChange={e => setTab(e.value)}
        unmountOnExit>
        <Tabs.List gap={4}>
          <TabTrigger value="Stationary" label="고정연소" icon={<LuFolder />} />
          <TabTrigger value="Mobile" label="이동연소" icon={<LuFolder />} />
          <TabTrigger value="IndirectE" label="간접배출(전기)" icon={<LuSquareCheck />} />
          <TabTrigger value="IndirectS" label="간접배출(스팀)" icon={<LuSettings />} />
        </Tabs.List>

        <TabContent value="Stationary">
          <Stationary />
        </TabContent>
        <TabContent value="Mobile">
          <Text>
            <Mobile />
          </Text>
        </TabContent>
        <TabContent value="IndirectE">
          <Text>
            <IndirectE />
          </Text>
        </TabContent>
        <TabContent value="IndirectS">
          <Text>
            <IndirectS />
          </Text>
        </TabContent>
      </Tabs.Root>
    </Box>
  )
}

export default SubsidiaryTab
