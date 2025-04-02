'use client'

import {useState} from 'react'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {SelectYear} from './graph'

const SubsidiaryDetail = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')

  return (
    <>
      <YearSelector props={{value: year, onValueChange: setYear}} />
      <SelectYear props={{subsidiaryId: subsidiaryId, year: year}} />
    </>
  )
}

export default SubsidiaryDetail
