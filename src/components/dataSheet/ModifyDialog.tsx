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
import {LuChevronLeft, LuChevronRight, LuFilePen} from 'react-icons/lu'
import {useEffect, useState} from 'react'
import {
  IChangeLogInfo,
  IEmissionInfo,
  IFuelInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
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
import ModifyDataTable from './ModifyDataTable'

const ModifyDialog = (
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
    getChangeLogs,
    emissionData,
    subsidiaryId,
    onClose,
    dialog
  } = props
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [data, setData] = useState<IEmissionInfo[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activityData, setActivityData] = useState<IFuelInfo[]>([])
  const [emissionActivity, setEmissionActivity] = useState<string[]>([])

  const [emissionDataIds, setEmissionDataIds] = useState<string[]>([])
  const [changeLogs, setChangeLogs] = useState<IChangeLogInfo[]>([])

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await getActivityData()
        setActivityData(response.data)
      } catch (error) {
        console.error(`Failed to fetch activity data`, error)
      }
    }

    const fetchData = async () => {
      try {
        const {data, total} = await getEmissionData({page, pageSize, id: subsidiaryId})
        setData(data)
        setTotalCount(total)
      } catch (error) {
        console.error(`Failed to fetch emission data`, error)
      }
    }
    fetchData()
    fetchActivityData()
    setEmissionActivity(emissionData)
  }, [page, pageSize, getEmissionData, getActivityData, subsidiaryId])

  const handleDelete = async (id: string) => {
    try {
      await deleteEmissionData(id)
      console.log('Data deleted successfully')
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }
  const handleUpdate = async (id: string, data: Partial<IEmissionForm>) => {
    try {
      await putEmissionData({id, data})
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  return (
    <Dialog.RootProvider size="cover" value={dialog}>
      <Dialog.Trigger asChild>
        <Button colorPalette="gray" variant="surface" px={4} size={'xs'}>
          <LuFilePen />
          데이터 수정하기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={4}>
            <Dialog.CloseTrigger asChild onClick={onClose}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Header padding={4}>
              <Dialog.Title>데이터 수정하기</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack width="100%">
                <ModifyDataTable
                  data={data}
                  settings={{
                    contextMenu: true,
                    stretchH: 'all'
                    // Add any other Handsontable settings here
                  }}
                  activityData={activityData}
                  emissionActivity={emissionActivity}
                  subsidiaryId={subsidiaryId}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onClose={onClose}
                  getChangeLogs={getChangeLogs}
                />

                <Pagination.Root
                  onPageChange={e => setPage(e.page)}
                  page={page}
                  count={totalCount}
                  pageSize={20}
                  defaultPage={1}>
                  <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                      <IconButton>
                        <LuChevronLeft />
                      </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Items
                      render={page => (
                        <IconButton variant={{base: 'ghost', _selected: 'outline'}}>
                          {page.value}
                        </IconButton>
                      )}
                    />

                    <Pagination.NextTrigger asChild>
                      <IconButton>
                        <LuChevronRight />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  )
}

export default ModifyDialog
