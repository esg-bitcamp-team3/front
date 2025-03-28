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
  Box,
  Span
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import AddEmmition from './addDetail/emmition_name'
import {getMyOrganizations} from '@/lib/api/my'
import {useRouter} from 'next/navigation'
import {Dataform_Station} from './addDetail/dataform/dataform_Station'
import {Dataform_Mobile} from './addDetail/dataform/dataform_Mobile'
import {TabContent} from './tabs_page'

const SubsidiaryDetail = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
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
                  subsidaryId={subsidiaryId}
                  onClose={() => setOpen(false)}
                />
              </Dialog.Body>
              <Dialog.Footer />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Span>
        <Dataform_Mobile subsidaryId={subsidiaryId} />
      </Span>
      <TabContent subsidiaryId={subsidiaryId} />
    </>
  )
}

export default SubsidiaryDetail
