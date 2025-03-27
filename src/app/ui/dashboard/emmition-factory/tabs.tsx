'use client'

import {deleteSubsidiary} from '@/lib/api/delete'
import {toaster} from '@/components/ui/toaster'
import {
  IOrganization,
  IOrganizationRevenue,
  ISubsidiary
} from '@/lib/api/interfaces/retrieveInterfaces'
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
  Box
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import AddEmmition from './addDetail/emmition_name'
import {getMyOrganizations} from '@/lib/api/my'
import {useRouter} from 'next/navigation'
import {Dataform_Station} from './addDetail/dataform/dataform_Station'
import {Dataform_Mobile} from './addDetail/dataform/dataform_Mobile'
import {TabContent} from './tabs_page'
import {SelectYear} from './graph'

const AddEmmitionFactory = () => {
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([])
  const [organization, setOrganization] = useState<IOrganization>()
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()

  const fetchSubsidiaryList = async () => {
    try {
      const response = await getMyOrganizations()
      setSubsidiaryList(response.data.subsidiaries)
      setOrganization(response.data.organization.organization)
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
    <SimpleGrid columns={2} gap="14" width="full">
      <Tabs.Root
        value={selectedTab}
        variant="subtle"
        size="lg"
        onValueChange={e => setSelectedTab(e.value)}>
        <Tabs.List
          display="flex"
          flex="1 1 auto"
          overflowX="auto"
          borderY="2px solid #E2E8F0"
          borderRadius="lg"
          justifyContent="center"
          alignItems="center"
          gap="4">
          {subsidiaryList.map(item => (
            <Tabs.Trigger
              padding={4}
              value={item._id}
              key={item._id}
              maxWidth="200px"
              flexGrow={0}>
              <Text
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                flexGrow={1}>
                {item.name}
              </Text>

              <CloseButton
                as="span"
                role="button"
                ml={2}
                size="sm"
                me="-2"
                onClick={e => {
                  e.stopPropagation()
                  removeTab(item._id)
                }}
              />
            </Tabs.Trigger>
          ))}

          <AddEmmition />
        </Tabs.List>

        <Tabs.ContentGroup>
          {subsidiaryList.map(item => (
            <Tabs.Content value={item._id} key={item._id}>
              {selectedTab === item._id && ( // 현재 선택된 탭만 렌더링
                <>
                  <SelectYear subsidiaryId={item._id} />
                  <Heading size="xl" my="6">
                    <Text m="5" fontSize="3xl">
                      {organization?.name} {item.industryType}
                    </Text>
                    <Text m="5">
                      {item.name} ( {item?.registrationNumber} )
                    </Text>
                  </Heading>
                  <Dialog.Root size="full" open={open}>
                    <Dialog.Trigger asChild onClick={() => setOpen(true)}>
                      <Button bg="blue.500">고정 연소</Button>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => setOpen(false)} />
                          </Dialog.CloseTrigger>
                          <Dialog.Header>
                            <Dialog.Title />
                          </Dialog.Header>
                          <Dialog.Body>
                            <Dataform_Station
                              subsidaryId={item._id}
                              onClose={() => setOpen(false)}
                            />
                          </Dialog.Body>
                          <Dialog.Footer />
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
                  <Dataform_Mobile subsidaryId={item._id} />
                  <TabContent subsidiaryId={item._id} />
                </>
              )}
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </SimpleGrid>
  )
}

export default AddEmmitionFactory
