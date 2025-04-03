'use client'

import {
  getEmissionDataFromStationaryCombustion,
  getChangeLogsOfEmissionDataFromElectricity,
  getEmissionDataFromElectricity
} from '@/lib/api/get'
import {ActivityDataForMobileCombustion} from '@/lib/api/interfaces/enumTypes'
import {
  IEmissionInfo,
  IChangeLogInfo,
  IFuelInfo,
  IEmissionFromMobileCombustion
} from '@/lib/api/interfaces/retrieveInterfaces'
import {IEmissionForm} from '@/lib/api/interfaces/updateForm'
import {updateEmissionDataFromElectricity} from '@/lib/api/put'
import {
  ActionBar,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Circle,
  createListCollection,
  Dialog,
  Float,
  For,
  Input,
  ListCollection,
  NativeSelect,
  Popover,
  Portal,
  Select,
  Switch,
  Table,
  Text
} from '@chakra-ui/react'
import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  MouseEvent,
  JSX,
  useMemo,
  memo,
  useCallback
} from 'react'
import ChangeLogs from './ChangeLogs'
import {PaginatedResponse} from '@/lib/api/type'
import {toaster} from '../ui/toaster'
import {
  RegisterOptions,
  set,
  useForm,
  UseFormRegister,
  UseFormRegisterReturn
} from 'react-hook-form'

// Define column names for consistency
const columnNames = [
  'data1', // 1월
  'data2', // 2월
  'data3', // 3월
  'data4', // 4월
  'data5', // 5월
  'data6', // 6월
  'data7', // 7월
  'data8', // 8월
  'data9', // 9월
  'data10', // 10월
  'data11', // 11월
  'data12' // 12월
]

// Update the RowData type to include _id for tracking
type RowData = IEmissionForm & {_id: string}

export interface AddSpreadsheetProps {
  activityData: IFuelInfo[]
  emissionActivity: string[]
  emissionData: IEmissionInfo[]
  onCreate: (data: IEmissionForm) => Promise<void>
  subsidaryId: string
}
const AddSpreadsheet = ({
  activityData,
  emissionActivity,
  emissionData,
  onCreate,
  subsidaryId
}: AddSpreadsheetProps) => {
  const [rows, setRows] = useState<number[]>([0])

  const addRow = () => {
    setRows([...rows, rows.length]) // 새로운 줄 추가
  }

  const {register, handleSubmit, reset, getValues, setValue} = useForm<{
    data: IEmissionForm[]
  }>({
    defaultValues: {data: []}
  })

  const emissionActivityCollection = useMemo(() => {
    return createListCollection({
      items: (emissionActivity || []).map(activity => ({
        value: activity,
        label: activity
      })),
      itemToString: (item: {value: string; label: string}) => item.label,
      itemToValue: (item: {value: string; label: string}) => item.value
    })
  }, [emissionActivity])

  const activityDataCollection = useMemo(() => {
    return createListCollection({
      items: (activityData || []).map(activity => ({
        value: activity.fuel._id,
        label: activity.fuel.name
      })),
      itemToString: (item: {value: string; label: string}) => item.label,
      itemToValue: (item: {value: string; label: string}) => item.value
    })
  }, [activityData])

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const hasSelection = selectedRows.length > 0
  const indeterminate = hasSelection && selectedRows.length < rows.length

  // Update handleSubmitChanges to use the new schema format
  const onSubmit = async ({data}: {data: IEmissionForm[]}) => {
    try {
      console.log('asdfd')
      const requestData = data.map(item => ({
        ...item,
        subsidiary: subsidaryId
      }))
      console.log('Request data:', requestData)

      const promises = requestData.map(item => onCreate(item))

      const response = await Promise.all(promises)

      // toaster.promise(response, {
      //   success: {
      //     title: '데이터가 저장되었습니다!'
      //   },
      //   error: {
      //     title: '데이터 저장 중 오류가 발생했습니다.'
      //   },
      //   loading: {title: '저장중...'}
      // })
    } catch (error) {
      toaster.error({
        title: '데이터 저장 중 오류가 발생했습니다.'
      })
    }
  }

  const calculateRowTotal = (row: RowData): number => {
    let total = 0
    for (let i = 1; i <= 12; i++) {
      const key = `data${i}` as keyof RowData
      const value = row[key]
      total += typeof value === 'number' ? value : 0
    }
    return total
  }

  const getColumnDisplayName = (colKey: string): string => {
    const displayNameMap: Record<string, string> = {
      facilityName: '시설명',
      emissionActivity: '배출 활동',
      activityData: '활동 데이터',
      total: '합계',
      uncertainty: '불확도',
      data1: '1월',
      data2: '2월',
      data3: '3월',
      data4: '4월',
      data5: '5월',
      data6: '6월',
      data7: '7월',
      data8: '8월',
      data9: '9월',
      data10: '10월',
      data11: '11월',
      data12: '12월'
    }

    return displayNameMap[colKey] || colKey
  }
  return (
    <div style={{width: '100% ', height: '100%'}}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? 'indeterminate' : selectedRows.length > 0}
                onCheckedChange={changes => {
                  setSelectedRows(changes.checked ? rows.map(row => row.toString()) : [])
                }}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              연도
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              번호
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              내부 시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              활동자료
            </Table.ColumnHeader>

            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              단위
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              합계
            </Table.ColumnHeader>
            {/* Monthly columns */}
            {columnNames.map(col => (
              <Table.ColumnHeader
                key={col}
                p={2}
                justifyContent="center"
                textAlign="center">
                {getColumnDisplayName(col)}
              </Table.ColumnHeader>
            ))}

            <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
              불확도
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, index) => (
            <Table.Row key={row}>
              <Table.Cell>
                <Checkbox.Root
                  padding={4}
                  size="sm"
                  top="0.5"
                  aria-label="Select row"
                  checked={selectedRows.includes(row.toString())}
                  onCheckedChange={changes => {
                    setSelectedRows(prev =>
                      changes.checked
                        ? [...prev, row.toString()]
                        : selectedRows.filter(id => id !== row.toString())
                    )
                  }}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              {/* Year */}
              <Table.Cell key={'year'}>
                <Input
                  type="number"
                  {...register(`data.${index}.year`, {
                    required: 'This is required'
                  })}
                />
              </Table.Cell>
              {/* Serial number */}
              <Table.Cell>
                <Input type="text" {...register(`data.${index}.serialNumber`, {})} />
              </Table.Cell>

              {/* Facility name */}
              <Table.Cell>
                <Input
                  type="text"
                  {...register(`data.${index}.facilityName`, {
                    required: 'This is required'
                  })}
                />
              </Table.Cell>

              {/* Emission activity */}
              <Table.Cell>
                <Select.Root
                  {...register(`data.${index}.emissionActivity`, {
                    required: 'This is required'
                  })}
                  mx={2}
                  collection={emissionActivityCollection}
                  size="md"
                  width="150px">
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {emissionActivityCollection.items.map(item => (
                        <Select.Item padding={2} item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Table.Cell>

              {/* Activity data - use the activityData ID for the dropdown */}
              <Table.Cell>
                <Select.Root
                  {...register(`data.${index}.activityData`, {
                    required: 'This is required'
                  })}
                  mx={2}
                  collection={activityDataCollection}
                  size="md"
                  width="150px">
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {activityDataCollection.items.map(item => (
                        <Select.Item padding={2} item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <Text>
                  {
                    activityData.find(
                      item => item.fuel._id === getValues(`data.${index}.activityData`)
                    )?.calorificValue?.gcv
                  }
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text>
                  {(() => {
                    const rowValues = getValues(`data.${index}`)
                    if (!rowValues) return 0

                    let total = 0
                    for (let i = 1; i <= 12; i++) {
                      const key = `data${i}` as keyof IEmissionForm
                      const value = parseFloat(String(rowValues[key] || '0'))
                      total += isNaN(value) ? 0 : value
                    }

                    setValue(`data.${index}.total`, total)

                    return total.toLocaleString()
                  })()}
                </Text>
              </Table.Cell>
              {/* Monthly data cells - use the direct data property names */}
              {columnNames.map(col => (
                <Table.Cell key={`${row}-${col}`}>
                  <Input
                    type="number"
                    {...register(`data.${index}.${col as keyof IEmissionForm}`, {
                      required: 'This is required'
                    })}
                  />
                </Table.Cell>
              ))}

              {/* Total and uncertainty */}

              <Table.Cell>
                <Input type="number" {...register(`data.${index}.uncertainty`, {})} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Center>
        <Button onClick={addRow} variant="outline">
          +
        </Button>
      </Center>

      <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          {/* <Button
                onClick={handleSubmitChanges}
                disabled={isSaving || (modifiedRows.size === 0 && deletedRows.size === 0)}
                style={{
                  backgroundColor:
                    modifiedRows.size > 0 || deletedRows.size > 0 ? '#4CAF50' : '#e0e0e0',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px'
                }}>
                {isSaving
                  ? 'Saving...'
                  : `Submit Changes${
                      modifiedRows.size > 0 || deletedRows.size > 0
                        ? ` (${modifiedRows.size + deletedRows.size})`
                        : ''
                    }`}
              </Button> */}

          <ActionBar.Root open={hasSelection}>
            <ActionBar.Positioner>
              <ActionBar.Content padding={4}>
                <ActionBar.SelectionTrigger padding={2}>
                  {selectedRows.length} 선택됨
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator />
                <Button variant="outline" size="sm" colorPalette="red" padding={2}>
                  삭제하기
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.Root>
          <ActionBar.Root open={rows.length > 0}>
            <ActionBar.Positioner>
              <ActionBar.Content padding={4}>
                <ActionBar.SelectionTrigger padding={2}>
                  {rows.length} 추가됨
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator />
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  variant="outline"
                  size="sm"
                  colorPalette="blue"
                  padding={2}>
                  저장하기
                </Button>
                <Button variant="outline" size="sm" colorPalette="red" padding={2}>
                  취소하기
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.Root>
        </div>
      </div>
    </div>
  )
}

export default AddSpreadsheet
