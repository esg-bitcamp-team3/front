'use client'

import {SelectTypeTab} from '@/lib/api/components/typeTabs'
import {YearSelector} from '@/lib/api/components/yearSelector'
import {ReactNode, useEffect, useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Pagination,
  Portal,
  Span,
  Stack,
  Tabs,
  useDialog,
  UseDialogReturn
} from '@chakra-ui/react'
import {Dataform_Station} from './addDetail/dataform/dataform_Station'
import {Dataform_Mobile} from './addDetail/dataform/dataform_Mobile'
import {
  getActivityDataForElectricity,
  getActivityDataForMobileCombustion,
  getActivityDataForStationaryCombustion,
  getActivityDataForSteam,
  getChangeLogsOfEmissionDataFromElectricity,
  getChangeLogsOfEmissionDataFromMobileCombustion,
  getChangeLogsOfEmissionDataFromStationaryCombustion,
  getChangeLogsOfEmissionDataFromSteam,
  getEmissionDataFromElectricity,
  getEmissionDataFromMobileCombustion,
  getEmissionDataFromStationaryCombustion,
  getEmissionDataFromSteam
} from '@/lib/api/get'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'
import {
  IChangeLogInfo,
  IEmissionInfo,
  IFuelInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
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
import AddDialog from '@/components/dataSheet/AddDialog'
import ModifyDialog from '@/components/dataSheet/ModifyDialog'
import DataTable from '@/components/dataSheet/DataTable'
import DataBox from '@/components/dataSheet/DataBox'

interface TabContentProps {
  value: string
  children: ReactNode
}

function TabContent({value, children}: TabContentProps) {
  return (
    <Box pos="relative" py={2} height="100%">
      <Tabs.Content
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
    </Box>
  )
}

function TabTable(
  props: EmissionProps & {
    subsidiaryId: string
    onClose: () => void
    dialog: UseDialogReturn
  }
) {}

interface TabTriggerProps {
  value: string
  label: string
}

function TabTrigger({value, label}: TabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      gap={2}
      fontSize="sm"
      fontWeight="semibold"
      _selected={{
        color: 'blue.500',
        borderColor: 'blue.500',
        fontWeight: 'bold'
      }}>
      {label}
    </Tabs.Trigger>
  )
}

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
  getChangeLogs: ({id}: {id: string}) => Promise<{data: IChangeLogInfo[]}>
  emissionData: string[]
}

export const TabContentData = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('')
  const [dataType, setDataType] = useState<ActivityDataType>(
    ActivityDataType.STAIONARY_COMBUSTION
  )
  const [data, setData] = useState<IEmissionInfo[]>([])
  const modifyDialog = useDialog()
  const addDialog = useDialog()

  const apiMap: Record<ActivityDataType, EmissionProps> = {
    [ActivityDataType.STAIONARY_COMBUSTION]: {
      getEmissionData: getEmissionDataFromStationaryCombustion,
      getActivityData: getActivityDataForStationaryCombustion,
      putEmissionData: updateEmissionDataFromStationaryCombustion,
      deleteEmissionData: deleteEmissionDataFromStationaryCombustion,
      createEmissionData: createStationaryCombustion,
      getChangeLogs: getChangeLogsOfEmissionDataFromStationaryCombustion,
      emissionData: Object.values(EmissionActivityTypeForStationaryCombustion)
    },
    [ActivityDataType.MOBILE_COMBUSTION]: {
      getEmissionData: getEmissionDataFromMobileCombustion,
      getActivityData: getActivityDataForMobileCombustion,
      putEmissionData: updateEmissionDataFromMobileCombustion,
      deleteEmissionData: deleteEmissionDataFromMobileCombustion,
      createEmissionData: createMobileCombustion,
      getChangeLogs: getChangeLogsOfEmissionDataFromMobileCombustion,
      emissionData: Object.values(EmissionActivityTypeForMobileCombustion)
    },
    [ActivityDataType.INDIRECT_ELECTRICITY]: {
      getEmissionData: getEmissionDataFromElectricity,
      getActivityData: getActivityDataForElectricity,
      putEmissionData: updateEmissionDataFromElectricity,
      deleteEmissionData: deleteEmissionDataFromElectricity,
      createEmissionData: createElectricity,
      getChangeLogs: getChangeLogsOfEmissionDataFromElectricity,
      emissionData: Object.values(IndirectEmissionActivityTypeForElectricity)
    },
    [ActivityDataType.INDIRECT_STEAM]: {
      getEmissionData: getEmissionDataFromSteam,
      getActivityData: getActivityDataForSteam,
      putEmissionData: updateEmissionDataFromSteam,
      deleteEmissionData: deleteEmissionDataFromSteam,
      createEmissionData: createSteam,
      getChangeLogs: getChangeLogsOfEmissionDataFromSteam,
      emissionData: Object.values(IndirectEmissionActivityTypeForSteam)
    }
  }

  const props = apiMap[dataType]

  const handleTabChange = (value: string) => {
    setDataType(value as ActivityDataType)
  }

  const handleClose = async () => {
    modifyDialog.setOpen(false)
    addDialog.setOpen(false)
    setYear('')
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width="full"
      shadow="md"
      borderRadius={'lg'}>
      <Tabs.Root
        padding={2}
        width={'full'}
        value={dataType}
        variant="plain"
        onValueChange={e => handleTabChange(e.value)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tabs.List bg="bg.muted" rounded="lg" gap={2} padding={1}>
            <Tabs.Trigger px={4} value={ActivityDataType.STAIONARY_COMBUSTION}>
              고정연소
            </Tabs.Trigger>
            <Tabs.Trigger px={4} value={ActivityDataType.MOBILE_COMBUSTION}>
              이동연소
            </Tabs.Trigger>
            <Tabs.Trigger px={4} value={ActivityDataType.INDIRECT_ELECTRICITY}>
              간접(전기)
            </Tabs.Trigger>
            <Tabs.Trigger px={4} value={ActivityDataType.INDIRECT_STEAM}>
              간접(스팀)
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          <YearSelector props={{value: year, onValueChange: setYear}} />
        </Box>
        <TabContent value={ActivityDataType.STAIONARY_COMBUSTION}>
          <HStack justifyContent="end" gap={2}>
            <ModifyDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={modifyDialog}
            />
            <AddDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={addDialog}
            />
          </HStack>
          <DataBox {...props} subsidiaryId={subsidiaryId} />
        </TabContent>
        <TabContent value={ActivityDataType.MOBILE_COMBUSTION}>
          <HStack justifyContent="end" gap={2}>
            <ModifyDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={modifyDialog}
            />
            <AddDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={addDialog}
            />
          </HStack>
          <DataBox {...props} subsidiaryId={subsidiaryId} />
        </TabContent>
        <TabContent value={ActivityDataType.INDIRECT_ELECTRICITY}>
          <HStack justifyContent="end" gap={2}>
            <ModifyDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={modifyDialog}
            />
            <AddDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={addDialog}
            />
          </HStack>
          <DataBox {...props} subsidiaryId={subsidiaryId} />
        </TabContent>
        <TabContent value={ActivityDataType.INDIRECT_STEAM}>
          <HStack justifyContent="end" gap={2}>
            <ModifyDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={modifyDialog}
            />
            <AddDialog
              {...props}
              subsidiaryId={subsidiaryId}
              onClose={handleClose}
              dialog={addDialog}
            />
          </HStack>
          <DataBox {...props} subsidiaryId={subsidiaryId} />
        </TabContent>
      </Tabs.Root>
    </Stack>
  )
}
