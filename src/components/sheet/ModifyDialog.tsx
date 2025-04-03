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

const ModifyEmissionData = (props: EmissionProps & {subsidiaryId: string}) => {
  const {
    getEmissionData,
    getActivityData,
    putEmissionData,
    deleteEmissionData,
    emissionData,
    subsidiaryId
  } = props
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [data, setData] = useState<IEmissionInfo[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activityData, setActivityData] = useState<IFuelInfo[]>([])
  const [emissionActivity, setEmissionActivity] = useState<string[]>([])

  useEffect(() => {
    const fetchEmissionData = async () => {
      const {data, total} = await getEmissionData({
        page,
        pageSize,
        id: subsidiaryId
      })
      setData(data)
      setTotalCount(total)
    }

    const fetchActivityData = async () => {
      try {
        const response = await getActivityData()
        console.log(response.data)
        setActivityData(response.data)
      } catch (error) {
        console.error(`Failed to fetch activity data`, error)
      }
    }

    fetchEmissionData()
    fetchActivityData()
    setEmissionActivity(emissionData)
  }, [page, pageSize])

  // Handle delete with the current API
  const handleDelete = (id: string) => {
    return deleteEmissionData(id)
  }

  // Handle update with the current API
  const handleUpdate = (id: string, data: Partial<IEmissionForm>) => {
    return putEmissionData({id, data})
  }

  return (
    <Dialog.Root size="cover">
      <Dialog.Trigger asChild>
        <Button colorPalette="orange" variant="solid" px={4} size={'xs'}>
          데이터 편집하기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={4}>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Header>
              <Dialog.Title>Modify Emission Data</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack width="100%">
                {data.length > 0 && (
                  <Spreadsheet
                    activityData={activityData}
                    emissionActivity={emissionActivity}
                    emissionData={data}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                )}
                <Pagination.Root
                  page={page}
                  count={totalCount}
                  pageSize={pageSize}
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
    </Dialog.Root>
  )
}

export default ModifyEmissionData
