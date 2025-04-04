'use client'

import React, {useMemo, useRef, useState} from 'react'
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
}

const DataTable: React.FC<HandsontableProps> = ({
  data,
  colHeaders = [
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
  activityData
}) => {
  const hotRef = useRef<HotTableRef>(null)

  const formattedTableData = useMemo(() => {
    return data.map(item => ({
      year: item.year,
      serialNumber: item.serialNumber || '',
      facilityName: item.facilityName || '',
      emissionActivity: item.emissionActivity || '',
      activityData: item.activityData?.name || '', // 이름으로 표시
      total: item.total || 0,
      uncertainty: item.uncertainty || 0,
      data1: item.data1 || 0,
      data2: item.data2 || 0,
      data3: item.data3 || 0,
      data4: item.data4 || 0,
      data5: item.data5 || 0,
      data6: item.data6 || 0,
      data7: item.data7 || 0,
      data8: item.data8 || 0,
      data9: item.data9 || 0,
      data10: item.data10 || 0,
      data11: item.data11 || 0,
      data12: item.data12 || 0,
      _id: item._id // 숨겨진 ID 열
    }))
  }, [data])

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
        data: 'year',
        type: 'numeric',
        numericFormat: {pattern: '0'},
        validator: yearValidator,
        readOnly: true
      }, // 연도
      {data: 'serialNumber', type: 'text', readOnly: true}, // 일련번호
      {data: 'facilityName', type: 'text', readOnly: true}, // 내부시설명
      {
        data: 'emissionActivity',
        type: 'dropdown',
        source: emissionActivityNames,
        readOnly: true
      }, // 배출활동
      {data: 'activityData', type: 'dropdown', source: activityDataNames, readOnly: true}, // 활동자료
      {
        data: 'unit',
        type: 'dropdown',
        source: ['kWh', 'L', 'km', 'kg', 'ton'],
        readOnly: true
      }, // 단위
      {data: 'total', type: 'numeric', readOnly: true, numericFormat: {pattern: '0.00'}}, // 합계
      {
        data: 'uncertainty',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        readOnly: true
      }, // 불확도
      {
        data: 'data1',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 1월
      {
        data: 'data2',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 2월
      {
        data: 'data3',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 3월
      {
        data: 'data4',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 4월
      {
        data: 'data5',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 5월
      {
        data: 'data6',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 6월
      {
        data: 'data7',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 7월
      {
        data: 'data8',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 8월
      {
        data: 'data9',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 9월
      {
        data: 'data10',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 10월
      {
        data: 'data11',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      }, // 11월
      {
        data: 'data12',
        type: 'numeric',
        numericFormat: {pattern: '0.00'},
        validator: dataValidator,
        readOnly: true
      } // 12월
    ],
    [emissionActivityNames, activityDataNames]
  )

  return (
    <Box width="100%" padding={4}>
      <HotTable
        ref={hotRef}
        data={formattedTableData}
        colHeaders={colHeaders}
        columns={columns}
        rowHeaders={rowHeaders}
        width={width}
        height={height}
        licenseKey={licenseKey}
        maxRows={10}
        minRows={10}
        readOnly={true} // Make entire table read-only
        disableVisualSelection={true} // Disable visual selection
        manualRowMove={false} // Disable row movement
        manualColumnMove={false} // Disable column movement
        contextMenu={false} // Disable context menu
        fillHandle={false}
        {...settings}
      />
    </Box>
  )
}

export default DataTable
