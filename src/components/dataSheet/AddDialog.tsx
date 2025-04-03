'use client'

import {
  getActivityDataForElectricity,
  getEmissionDataFromElectricity
} from '@/lib/api/get'
import {
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  IconButton,
  Pagination,
  Portal,
  useDialog,
  UseDialogReturn,
  VStack
} from '@chakra-ui/react'
import {LuChevronLeft, LuChevronRight, LuFilePlus2} from 'react-icons/lu'
import {useEffect, useState} from 'react'
import {IEmissionInfo, IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {deleteEmissionDataFromElectricity} from '@/lib/api/delete'
import {EmissionActivityTypeForMobileCombustion} from '@/lib/api/interfaces/enumTypes'
import {updateEmissionDataFromElectricity} from '@/lib/api/put'
import {
  ActivityDataType,
  EmissionProps
} from '@/app/ui/dashboard/emmition-factory/subTabData'
import {IEmissionForm} from '@/lib/api/interfaces/updateForm'
import {useForm} from 'react-hook-form'
import AddSpreadsheet from './AddDataTable'
import {Data} from '@react-google-maps/api'
import AddDataTable from './AddDataTable'
import {create} from 'domain'

const AddDialog = (
  props: EmissionProps & {
    subsidiaryId: string
    onClose: () => void
    dialog: UseDialogReturn
  }
) => {
  const {
    getEmissionData,
    getActivityData,
    putEmissionData,
    deleteEmissionData,
    createEmissionData,
    emissionData,
    subsidiaryId,
    onClose,
    dialog
  } = props
  const [activityData, setActivityData] = useState<IFuelInfo[]>([])
  const [emissionActivity, setEmissionActivity] = useState<string[]>([])

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await getActivityData()
        setActivityData(response.data)
      } catch (error) {
        console.error(`Failed to fetch activity data`, error)
      }
    }

    fetchActivityData()
    setEmissionActivity(emissionData)
  }, [])

  const handleCreate = async (data: IEmissionForm) => {
    try {
      const response = await createEmissionData({
        data: data
      })
    } catch (error) {
      console.error('Error creating data:', error)
    }
  }

  const handleClose = () => {
    dialog.setOpen(false)
    onClose()
  }

  return (
    <Dialog.RootProvider size="cover" value={dialog}>
      <Dialog.Trigger asChild>
        <Button colorPalette="gray" variant="surface" px={4} size={'xs'}>
          <LuFilePlus2 /> 데이터 추가하기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={4}>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Header padding={4}>
              <Dialog.Title>데이터 추가하기</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack width="100%">
                <AddDataTable
                  data={[]}
                  settings={{
                    contextMenu: true,
                    stretchH: 'all'
                    // Add any other Handsontable settings here
                  }}
                  activityData={activityData}
                  emissionActivity={emissionActivity}
                  subsidiaryId={subsidiaryId}
                  onCreate={handleCreate}
                  onClose={handleClose}
                />
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  )
}

export default AddDialog
