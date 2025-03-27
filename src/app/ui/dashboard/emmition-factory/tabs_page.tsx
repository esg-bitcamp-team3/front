'use client'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {TypeSelector} from '@/lib/api/components/typeSeletor'

export const TabContent = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')
  const [dataType, setDataType] = useState<string>('mobile')
  return (
    <>
      <YearSelector props={{value: year, onValueChange: setYear}} />

      <TypeSelector props={{value: dataType, onValueChange: setDataType}} />
      <StationTable
        props={{year: year, subsidiaryId: subsidiaryId, dataType: dataType}}
      />
    </>
  )
}
