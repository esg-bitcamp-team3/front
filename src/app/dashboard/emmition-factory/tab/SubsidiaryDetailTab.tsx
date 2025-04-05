'use client'

import {TabContentData} from '@/app/ui/dashboard/emmition-factory/subTabData'
import SubsidiaryDetail from '@/app/ui/dashboard/emmition-factory/tabs'
import {Box, Flex, Tabs, Text} from '@chakra-ui/react'
import {ReactNode, useEffect, useState} from 'react'
import {LuChartLine, LuFolder, LuSettings, LuSquareCheck, LuTable} from 'react-icons/lu'
import SubsidiaryDetailData from '../[id]/SubsidiaryDetail'
import {ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {toaster} from '@/components/ui/toaster'
import {getSubsidiaryById} from '@/lib/api/get'

interface TabContentProps {
  value: string
  children: ReactNode
}

function TabContent({value, children}: TabContentProps) {
  return (
    <Tabs.Content
      py={2}
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
      value={value}
      gap={2}
      padding={2}
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
  const [subsidiary, setSubsidiary] = useState<ISubsidiary>()
  const fetchSubsidiary = async (id: string) => {
    try {
      const response = await getSubsidiaryById(id)
      setSubsidiary(response.data)
    } catch (error) {
      toaster.error({
        title: '데이터를 가져오는 중 오류가 발생했습니다.'
      })
    }
  }
  useEffect(() => {
    if (subsidiaryId) {
      fetchSubsidiary(subsidiaryId)
    }
  }, [subsidiaryId])
  const [tab, setTab] = useState('detail')
  return (
    <Box borderBottom="1px">
      {' '}
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bold">
          {subsidiary?.name || '-'}
        </Text>
      </Flex>
      <br />
      <Tabs.Root
        value={tab}
        onValueChange={e => setTab(e.value)}
        px={6}
        variant="line"
        colorPalette="blue"
        lazyMount
        unmountOnExit>
        <Tabs.List gap={4}>
          <TabTrigger value="detail" label="세부 정보" icon={<LuFolder />} />
          <TabTrigger value="graph" label="데이터 분석" icon={<LuChartLine />} />
          <TabTrigger value="data" label="데이터" icon={<LuTable />} />
        </Tabs.List>
        <TabContent
          value="detail"
          children={<SubsidiaryDetailData subsidiaryId={subsidiaryId} />}></TabContent>
        <TabContent
          value="graph"
          children={<SubsidiaryDetail subsidiaryId={subsidiaryId} />}></TabContent>
        <TabContent
          value="data"
          children={<TabContentData subsidiaryId={subsidiaryId} />}
        />
      </Tabs.Root>
    </Box>
  )
}

export default SubsidiaryTab
