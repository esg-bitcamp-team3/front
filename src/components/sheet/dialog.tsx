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

enum ActivityDataType {
  FIXED_COMBUSTION = '고정연소',
  MOBILE_COMBUSTION = '이동연소',
  INDIRECT_ELECTRICITY = '간접(전기)',
  INDIRECT_STEAM = '간접(스팀)'
}

const ModifyEmissionData = ({type}: {type: ActivityDataType}) => {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [data, setData] = useState<IEmissionInfo[]>([])
  const [activityData, setActivityData] = useState<IFuelInfo[]>([])
  const [emissionActivity, setEmissionActivity] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmissionDataFromElectricity({
        id: '67e4cd11523dba9aa704a577',
        page,
        pageSize
      })
      console.log(response.data)
      setData(response.data)
      setTotalCount(response.total)
    }
    fetchData()

    const fetchActivityData = async () => {
      const response = await getActivityDataForElectricity()
      console.log(response.data)
      setActivityData(response.data)
    }
    fetchActivityData()

    setEmissionActivity(Object.values(EmissionActivityTypeForMobileCombustion))
  }, [page, pageSize])

  return (
    <Dialog.Root size="cover">
      <Dialog.Trigger asChild>
        <Button>asdf</Button>
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
                    onDelete={deleteEmissionDataFromElectricity}
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
