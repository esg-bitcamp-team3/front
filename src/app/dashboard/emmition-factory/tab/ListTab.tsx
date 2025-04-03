'use client'

import {deleteSubsidiary} from '@/lib/api/delete'
import {toaster} from '@/components/ui/toaster'
import {IOrganization, ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Button,
  CloseButton,
  Heading,
  Tabs,
  Text,
  For,
  SimpleGrid,
  Dialog,
  Flex,
  Portal,
  Box,
  Span
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {getMyOrganizations} from '@/lib/api/my'
import AddEmmition from '@/app/ui/dashboard/emmition-factory/addDetail/emmition_name'
import SubsidiaryTab from './SubsidiaryDetailTab'

const SubsidiaryListTab = () => {
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([])
  const [organization, setOrganization] = useState<IOrganization>()
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()

  const fetchSubsidiaryList = async () => {
    try {
      const response = await getMyOrganizations()
      setSubsidiaryList(response.data.subsidiaries)
      setOrganization(response.data.organization)
    } catch (error) {
      router.push('/login')
    }
  }

  useEffect(() => {
    fetchSubsidiaryList()
  }, [])

  const [selectedTab, setSelectedTab] = useState<string | null>()

  const removeTab = async (_id: string) => {
    deleteSubsidiary(_id)
    fetchSubsidiaryList()
  }

  return (
    <Tabs.Root
      value={selectedTab}
      variant="enclosed"
      size="lg"
      onValueChange={e => setSelectedTab(e.value)}>
      <Tabs.List display="flex" flex="1 1 auto" overflowX="auto" gap="4">
        {subsidiaryList.map(item => (
          <Tabs.Trigger padding={4} value={item._id} key={item._id}>
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              flexGrow={1}
              textStyle="md"
              fontWeight="bold">
              {item.name}
            </Text>
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
        <AddEmmition />
      </Tabs.List>

      <Tabs.ContentGroup>
        {subsidiaryList.map(item => (
          <Tabs.Content padding={8} value={item._id} key={item._id}>
            {selectedTab === item._id && ( // 현재 선택된 탭만 렌더링
              <>
                <SubsidiaryTab subsidiaryId={item._id} />
              </>
            )}
          </Tabs.Content>
        ))}
      </Tabs.ContentGroup>
    </Tabs.Root>
  )
}

export default SubsidiaryListTab
