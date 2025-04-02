'use client'

import {SelectTypeTab} from '@/lib/api/components/typeTabs'
import {YearSelector} from '@/lib/api/components/yearSelector'
import {useEffect, useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  IconButton,
  Pagination,
  Portal,
  Span,
  Stack,
  Tabs
} from '@chakra-ui/react'
import {Dataform_Station} from './addDetail/dataform/dataform_Station'
import {Dataform_Mobile} from './addDetail/dataform/dataform_Mobile'
import {
  getActivityDataForElectricity,
  getActivityDataForMobileCombustion,
  getActivityDataForStationaryCombustion,
  getActivityDataForSteam,
  getEmissionDataFromElectricity,
  getEmissionDataFromMobileCombustion,
  getEmissionDataFromStationaryCombustion,
  getEmissionDataFromSteam
} from '@/lib/api/get'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'
import {IEmissionInfo, IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  updateEmissionDataFromElectricity,
  updateEmissionDataFromMobileCombustion,
  updateEmissionDataFromStationaryCombustion,
  updateEmissionDataFromSteam
} from '@/lib/api/put'
import {
  deleteEmissionDataFromElectricity,
  deleteEmissionDataFromMobileCombustion,
  deleteEmissionDataFromStationaryCombustion,
  deleteEmissionDataFromSteam
} from '@/lib/api/delete'
import {IEmissionForm} from '@/lib/api/interfaces/updateForm'
import {
  EmissionActivityTypeForMobileCombustion,
  EmissionActivityTypeForStationaryCombustion,
  IndirectEmissionActivityTypeForElectricity,
  IndirectEmissionActivityTypeForSteam
} from '@/lib/api/interfaces/enumTypes'
import ModifyEmissionData from '@/components/sheet/ModifyDialog'
import {
  createElectricity,
  createMobileCombustion,
  createStationaryCombustion,
  createSteam
} from '@/lib/api/post'
import AddEmissionData from '@/components/sheet/AddDialog'

export enum ActivityDataType {
  STAIONARY_COMBUSTION = '고정연소',
  MOBILE_COMBUSTION = '이동연소',
  INDIRECT_ELECTRICITY = '간접(전기)',
  INDIRECT_STEAM = '간접(스팀)'
}

export interface EmissionProps {
  getEmissionData: (params: {
    id: string
    page: number
    pageSize?: number
    year?: string
  }) => Promise<{data: IEmissionInfo[]; total: number}>
  getActivityData: () => Promise<{data: IFuelInfo[]}>
  putEmissionData: (params: {
    id: string
    data: Partial<IEmissionForm>
  }) => Promise<{data: IEmissionInfo}>
  deleteEmissionData: (id: string) => Promise<{data: string}>
  createEmissionData: (params: {
    data: Partial<IEmissionForm>
  }) => Promise<{data: IEmissionInfo}>
  emissionData: string[]
}

export const TabContentData = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')
  const [dataType, setDataType] = useState<ActivityDataType>(
    ActivityDataType.STAIONARY_COMBUSTION
  )
  const [page, setPage] = useState<number>(1)
  const pageSize = 10
  const [data, setData] = useState<IEmissionInfo[]>([])

  const [totalCount, setTotalCount] = useState<number>(0)

  const apiMap: Record<ActivityDataType, EmissionProps> = {
    [ActivityDataType.STAIONARY_COMBUSTION]: {
      getEmissionData: getEmissionDataFromStationaryCombustion,
      getActivityData: getActivityDataForStationaryCombustion,
      putEmissionData: updateEmissionDataFromStationaryCombustion,
      deleteEmissionData: deleteEmissionDataFromStationaryCombustion,
      createEmissionData: createStationaryCombustion,
      emissionData: Object.values(EmissionActivityTypeForStationaryCombustion)
    },
    [ActivityDataType.MOBILE_COMBUSTION]: {
      getEmissionData: getEmissionDataFromMobileCombustion,
      getActivityData: getActivityDataForMobileCombustion,
      putEmissionData: updateEmissionDataFromMobileCombustion,
      deleteEmissionData: deleteEmissionDataFromMobileCombustion,
      createEmissionData: createMobileCombustion,
      emissionData: Object.values(EmissionActivityTypeForMobileCombustion)
    },
    [ActivityDataType.INDIRECT_ELECTRICITY]: {
      getEmissionData: getEmissionDataFromElectricity,
      getActivityData: getActivityDataForElectricity,
      putEmissionData: updateEmissionDataFromElectricity,
      deleteEmissionData: deleteEmissionDataFromElectricity,
      createEmissionData: createElectricity,
      emissionData: Object.values(IndirectEmissionActivityTypeForElectricity)
    },
    [ActivityDataType.INDIRECT_STEAM]: {
      getEmissionData: getEmissionDataFromSteam,
      getActivityData: getActivityDataForSteam,
      putEmissionData: updateEmissionDataFromSteam,
      deleteEmissionData: deleteEmissionDataFromSteam,
      createEmissionData: createSteam,
      emissionData: Object.values(IndirectEmissionActivityTypeForSteam)
    }
  }

  const props = apiMap[dataType]
  useEffect(() => {
    const fetchEmissionData = async () => {
      const {data, total} = await props.getEmissionData({
        page,
        pageSize,
        id: subsidiaryId,
        year
      })
      setData(data)
      setTotalCount(total)
    }

    fetchEmissionData()
  }, [page, pageSize, dataType])

  const handleTabChange = (value: string) => {
    setDataType(value as ActivityDataType)
    setPage(1) // Reset page when changing tabs
  }

  return (
    <Stack justifyContent="center" alignItems="center" width="full">
      <YearSelector props={{value: year, onValueChange: setYear}} />
      <Box display="flex" justifyContent="space-between">
        <Tabs.Root
          value={dataType}
          variant="plain"
          onValueChange={e => handleTabChange(e.value)}>
          <Tabs.List bg="bg.muted" rounded="l3" gap={2} padding={1}>
            <Tabs.Trigger padding={2} value={ActivityDataType.STAIONARY_COMBUSTION}>
              고정연소
            </Tabs.Trigger>
            <Tabs.Trigger padding={2} value={ActivityDataType.MOBILE_COMBUSTION}>
              이동연소
            </Tabs.Trigger>
            <Tabs.Trigger padding={2} value={ActivityDataType.INDIRECT_ELECTRICITY}>
              간접(전기)
            </Tabs.Trigger>
            <Tabs.Trigger padding={2} value={ActivityDataType.INDIRECT_STEAM}>
              간접(스팀)
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          <Tabs.Content value={ActivityDataType.STAIONARY_COMBUSTION}>
            <ModifyEmissionData {...props} subsidiaryId={subsidiaryId} />
            <AddEmissionData {...props} subsidiaryId={subsidiaryId} />
            <StationTable data={data} />
          </Tabs.Content>
          <Tabs.Content value={ActivityDataType.MOBILE_COMBUSTION}>
            <StationTable data={data} />
          </Tabs.Content>
          <Tabs.Content value={ActivityDataType.INDIRECT_ELECTRICITY}>
            <StationTable data={data} />
          </Tabs.Content>
          <Tabs.Content value={ActivityDataType.INDIRECT_STEAM}>
            <StationTable data={data} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      {totalCount > 0 && (
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
      )}
    </Stack>
  )
}
