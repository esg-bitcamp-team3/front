'use client'

import React, {memo, useMemo, useRef, useState} from 'react'
import {HotTable, HotTableRef} from '@handsontable/react-wrapper'
import {registerAllModules} from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.min.css'
import {createStationaryCombustion} from '@/lib/api/post'
import {ActionBar, Box, Button, createListCollection, Portal} from '@chakra-ui/react'
import {IEmissionInfo, IFuelInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {CellChange} from 'handsontable/common'
import {EmissionProps} from '@/app/ui/dashboard/emmition-factory/subTabData'
import {IEmissionForm} from '@/lib/api/interfaces/updateForm'
import {toaster} from '../ui/toaster'
import {set} from 'react-hook-form'

// Register all Handsontable modules
registerAllModules()

interface HandsontableProps {
  data: IEmissionInfo[]
  emissionActivity: string[]
  activityData: IFuelInfo[]
  colHeaders?: string[] | boolean
  rowHeaders?: string[] | boolean
  width?: string | number
  height?: string | number
  licenseKey?: string
  settings?: any
  subsidiaryId: string
  onCreate: (data: IEmissionForm) => Promise<void>
  onClose: () => void
}

const AddDataTable: React.FC<HandsontableProps> = ({
  data = [[]],
  colHeaders = [
    '선택',
    '연도',
    '일련번호',
    '내부시설명',
    '배출활동',
    '활동자료',
    '단위',
    '합계',
    '불확도',
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ],
  rowHeaders = true,
  width = '100%',
  height = 300,
  licenseKey = 'non-commercial-and-evaluation',
  settings = {},
  emissionActivity,
  activityData,
  onCreate,
  onClose,
  subsidiaryId
}) => {
  const hotRef = useRef<HotTableRef>(null)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [addedRows, setAddedRows] = useState<Set<number>>(new Set())

  // Extract dropdown sources from collections
  const emissionActivityNames = useMemo(
    () => emissionActivity.map(activity => activity),
    [emissionActivity]
  )

  const activityDataNames = useMemo(
    () => activityData.map(activity => activity.fuel.name),
    [activityData]
  )

  // Create mapping from name to ID for activity data
  const activityDataDropdownMap = useMemo(() => {
    const map = new Map()
    activityData.forEach(activity => {
      map.set(activity.fuel.name, activity.fuel._id)
    })
    return map
  }, [activityData])

  const yearValidator = (value: string, callback: (valid: boolean) => void) => {
    if (value === null || value === undefined || value === '') {
      callback(true) // Allow empty values for new rows
      return
    }

    const year = parseInt(value, 10)
    const currentYear = new Date().getFullYear()

    // Check if it's a valid number and within reasonable range (1900-2100)
    if (isNaN(year) || year < 1900 || year > 2100) {
      callback(false)
      return
    }

    callback(true)
  }

  const dataValidator = (value: number, callback: (valid: boolean) => void) => {
    // Allow empty values for new rows
    if (value === null || value === undefined) {
      callback(true)
      return
    }

    // Check if it's a valid number and greater than 0
    if (isNaN(value) || value <= 0) {
      callback(false)
      return
    }

    callback(true)
  }

  const columns = useMemo(
    () => [
      {
        data: 'selected',
        type: 'checkbox',
        className: 'htCenter'
      },
      {
        data: 'year',
        type: 'numeric',
        numericFormat: {pattern: '0'},
        validator: yearValidator
      }, // 연도
      {data: 'serialNumber', type: 'text'}, // 일련번호
      {data: 'facilityName', type: 'text'}, // 내부시설명
      {data: 'emissionActivity', type: 'dropdown', source: emissionActivityNames}, // 배출활동
      {data: 'activityData', type: 'dropdown', source: activityDataNames}, // 활동자료
      {data: 'unit', type: 'text', readOnly: true}, // 단위
      {data: 'total', type: 'numeric', readOnly: true, numericFormat: {pattern: '0.00'}}, // 합계
      {data: 'uncertainty', type: 'numeric', numericFormat: {pattern: '0.00'}}, // 불확도
      {
        data: 'data1',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 1월
      {
        data: 'data2',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 2월
      {
        data: 'data3',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 3월
      {
        data: 'data4',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 4월
      {
        data: 'data5',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 5월
      {
        data: 'data6',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 6월
      {
        data: 'data7',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 7월
      {
        data: 'data8',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 8월
      {
        data: 'data9',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 9월
      {
        data: 'data10',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 10월
      {
        data: 'data11',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      }, // 11월
      {
        data: 'data12',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator
      } // 12월
    ],
    [emissionActivityNames, activityDataNames]
  )

  const afterChangeCallback = (changes: CellChange[] | null, source: string): void => {
    if (!changes || !hotRef.current || !hotRef.current.hotInstance) return

    const hot = hotRef.current.hotInstance

    changes?.forEach(changes => {
      const [row, prop, oldValue, newValue] = changes

      // Track newly added rows
      if (row !== undefined) {
        setAddedRows(prev => new Set([...prev, row]))
      }

      // Handle checkbox selection
      if (prop === 'selected') {
        setSelectedRows(prev => {
          const newSet = new Set(prev)
          newValue ? newSet.add(row as number) : newSet.delete(row as number)
          return newSet
        })
      }

      if (prop === 'activityData') {
        hot.setDataAtRowProp(
          row,
          'unit',
          activityData.find(activity => newValue === activity.fuel.name)?.fuel.unit
        )
      }

      // Check if the change is in one of the data columns (data1 to data12)
      if (typeof prop === 'string' && prop.startsWith('data')) {
        // Calculate total - sum of all monthly data (data1 through data12)
        const rowData = hot.getSourceDataAtRow(row) as Record<string, any>

        // Convert string values to numbers and handle null/undefined
        const sum = [
          'data1',
          'data2',
          'data3',
          'data4',
          'data5',
          'data6',
          'data7',
          'data8',
          'data9',
          'data10',
          'data11',
          'data12'
        ].reduce((acc, key) => {
          const value = parseFloat(rowData[key]) || 0
          return acc + value
        }, 0)

        // Update the total column with the calculated sum
        hot.setDataAtRowProp(row, 'total', sum)
      }
    })
  }

  const afterValidationCallback = (
    valid: boolean,
    value: string,
    row: number,
    prop: string
  ) => {
    if (!valid) {
      toaster.error({
        title: '데이터를 확인해주세요'
      })
    }
  }

  const onSubmit = () => {
    if (!hotRef.current) return

    const hot = hotRef.current.hotInstance

    if (!hot) return

    const tableData = hot?.getData()

    if (!tableData) return

    try {
      // Convert to schema format
      const formattedData: IEmissionForm[] = []
      const invalidRows: number[] = []

      tableData.forEach((row, rowIndex) => {
        // Skip last row if it's the empty spare row
        if (
          rowIndex === tableData.length - 1 &&
          !row[1] &&
          !row[2] &&
          !row[3] &&
          !row[4] &&
          !row[5]
        ) {
          return
        }

        // Check required fields
        const requiredFields = [
          {index: 1, name: '연도'},
          {index: 3, name: '내부시설명'},
          {index: 4, name: '배출활동'},
          {index: 5, name: '활동자료'}
        ]

        const missingFields = requiredFields.filter(field => !row[field.index])

        // Check if any monthly data exists
        const hasMonthlyData = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].some(
          idx => row[idx] !== null && row[idx] !== undefined && row[idx] !== ''
        )

        if (missingFields.length > 0 || !hasMonthlyData) {
          invalidRows.push(rowIndex + 1) // +1 for human-readable row numbers
          return
        }

        // Check if the hot instance has validation errors for this row
        const hasValidationErrors = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
        ].some(colIndex => hot.getCellMeta(rowIndex, colIndex).valid === false)

        if (hasValidationErrors) {
          invalidRows.push(rowIndex + 1) // +1 for human-readable row numbers
          return
        }

        // Row is valid, add to formatted data
        formattedData.push({
          subsidiary: subsidiaryId,
          year: parseInt(row[1]) || new Date().getFullYear(),
          serialNumber: row[2] || '',
          facilityName: row[3] || '',
          emissionActivity: row[4] || '',
          activityData: activityDataDropdownMap.get(row[5]) || row[5] || '',
          total: parseFloat(row[7]) || 0,
          uncertainty: parseFloat(row[8]) || 0,
          data1: parseFloat(row[9]) || 0,
          data2: parseFloat(row[10]) || 0,
          data3: parseFloat(row[11]) || 0,
          data4: parseFloat(row[12]) || 0,
          data5: parseFloat(row[13]) || 0,
          data6: parseFloat(row[14]) || 0,
          data7: parseFloat(row[15]) || 0,
          data8: parseFloat(row[16]) || 0,
          data9: parseFloat(row[17]) || 0,
          data10: parseFloat(row[18]) || 0,
          data11: parseFloat(row[19]) || 0,
          data12: parseFloat(row[20]) || 0
        })
      })

      // If there are invalid rows, show error message
      if (invalidRows.length > 0) {
        toaster.error({
          title: '데이터 형식이 올바르지 않습니다',
          description: `${invalidRows.join(', ')}번째 데이터를 확인해주세요:`
        })
        return
      }

      // If there's no valid data to submit
      if (formattedData.length === 0) {
        toaster.error({
          title: '저장할 데이터가 없습니다',
          description: '데이터를 입력해주세요.'
        })
        return
      }

      // Send valid data
      const savePromises = formattedData.map(rowData => onCreate(rowData))

      const response = Promise.all(savePromises)
      toaster.promise(response, {
        loading: {
          title: '저장 중...'
        },
        success: {
          title: '데이터가 저장되었습니다'
        },
        error: {
          title: '저장 중 오류가 발생했습니다',
          description: '데이터를 확인해주세요'
        }
      })

      hot.clear()
      onClose() // Close the dialog
    } catch (error) {
      toaster.error({
        title: '데이터 생성 중 문제가 발생했습니다.',
        description: '데이터를 확인해주세요.'
      })
    }
  }

  const handleDeleteSelectedRows = () => {
    if (!hotRef.current || !hotRef.current.hotInstance) return

    const hot = hotRef.current.hotInstance

    const sortedSelectedRows = [...selectedRows].sort((a, b) => b - a)

    // Remove the rows starting from the highest index
    sortedSelectedRows.forEach(rowIndex => {
      hot.alter('remove_row', rowIndex, 1)
    })

    // Remove the deleted rows from addedRows state as well
    setAddedRows(prevAddedRows => {
      const newAddedRows = new Set(prevAddedRows)
      selectedRows.forEach(rowIndex => {
        newAddedRows.delete(rowIndex)
      })
      return newAddedRows
    })

    setSelectedRows(new Set())

    toaster.success({
      title: `${sortedSelectedRows.length}개 행이 삭제되었습니다.`
    })
  }

  return (
    <Box width="100%" padding={4}>
      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={colHeaders}
        columns={columns}
        rowHeaders={rowHeaders}
        width={width}
        height={height}
        licenseKey={licenseKey}
        afterChange={afterChangeCallback}
        afterValidate={afterValidationCallback}
        minSpareRows={1}
        autoRowSize={false}
        autoColumnSize={false}
        {...settings}
      />
      <ActionBar.Root open={true}>
        <ActionBar.Positioner>
          <ActionBar.Content padding={4}>
            <ActionBar.SelectionTrigger padding={2}>
              {selectedRows.size > 0
                ? `${selectedRows.size}개 데이터 선택됨`
                : `${addedRows.size}개 데이터 추가됨`}
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            {selectedRows.size > 0 ? (
              <Button
                variant="outline"
                size="sm"
                colorPalette="red"
                padding={2}
                marginRight={2}
                onClick={handleDeleteSelectedRows}>
                삭제하기
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                colorPalette="blue"
                padding={2}
                onClick={onSubmit}>
                저장하기
              </Button>
            )}
          </ActionBar.Content>
        </ActionBar.Positioner>
      </ActionBar.Root>
    </Box>
  )
}

export default AddDataTable
