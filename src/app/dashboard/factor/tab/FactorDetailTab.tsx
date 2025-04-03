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
    <Tabs.Content
      py={4}
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
      padding={2}
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

const InfoTab = () => {
  const [tab, setTab] = useState('Stationary')

  return (
    <Box borderBottom="1px">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bold">
          배출량 산출 계산식 및 매개변수
        </Text>
      </Flex>
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
          <TabTrigger value="IndirectE" label="간접배출(전기)" icon={<LuFolder />} />
          <TabTrigger value="IndirectS" label="간접배출(스팀)" icon={<LuFolder />} />
        </Tabs.List>

        <TabContent value="Stationary" children={<Stationary />} />
        <TabContent value="Mobile" children={<Mobile />} />
        <TabContent value="IndirectE" children={<IndirectE />} />
        <TabContent value="IndirectS" children={<IndirectS />} />
      </Tabs.Root>
    </Box>
  )
}

export default InfoTab
