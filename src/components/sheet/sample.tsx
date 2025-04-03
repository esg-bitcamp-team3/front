'use client'

import {
  getActivityDataForElectricity,
  getEmissionDataFromElectricity
} from '@/lib/api/get'
import Spreadsheet from './Sheet'
import {
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  IconButton,
  Pagination,
  Portal,
  useDialog,
  VStack
} from '@chakra-ui/react'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'
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
import AddSpreadsheet from './AddSheet'
import {Data} from '@react-google-maps/api'
import HandsontableComponent from './handsontable'
import {create} from 'domain'

const Sample = (props: EmissionProps & {subsidiaryId: string; onClose: () => void}) => {
  const {
    getEmissionData,
    getActivityData,
    putEmissionData,
    deleteEmissionData,
    createEmissionData,
    emissionData,
    subsidiaryId,
    onClose
  } = props
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [data, setData] = useState<IEmissionInfo[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activityData, setActivityData] = useState<IFuelInfo[]>([])
  const [emissionActivity, setEmissionActivity] = useState<string[]>([])
  const dialog = useDialog()

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
  }, [page, pageSize])

  const handleCreate = async (data: IEmissionForm) => {
    try {
      console.log('asefdf')
      console.log(data)
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
        <Button colorPalette="teal" variant="solid" px={4} size={'xs'}>
          데이터 추가하기
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
                <HandsontableComponent
                  data={data}
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

export default Sample
