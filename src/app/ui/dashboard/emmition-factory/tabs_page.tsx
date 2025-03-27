'use client'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {SelectTypeTab} from '@/lib/api/components/typeTabs'

export const TabContent = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')
  const [dataType, setDataType] = useState<string>('station')

  return (
    <>
      <YearSelector props={{value: year, onValueChange: setYear}} />
      <SelectTypeTab props={{value: dataType, onValueChange: setDataType}} />
      <StationTable
        props={{year: year, subsidiaryId: subsidiaryId, dataType: dataType}}
      />
    </>
  )
}
