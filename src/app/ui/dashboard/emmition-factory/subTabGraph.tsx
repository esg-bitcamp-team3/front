'use client'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {SelectTypeTab} from '@/lib/api/components/typeTabs'
import {SelectYear} from './graph'
import {Box} from '@chakra-ui/react'

export const TabContent = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')
  const [dataType, setDataType] = useState<string>('station')

  return (
    <>
      <Box spaceY={12}>
        <Box>
          <YearSelector props={{value: year, onValueChange: setYear}} />
          <SelectYear props={{subsidiaryId: subsidiaryId, year: year}} />
        </Box>
        <Box spaceY={-1}>
          <SelectTypeTab props={{value: dataType, onValueChange: setDataType}} />
          <StationTable
            props={{year: year, subsidiaryId: subsidiaryId, dataType: dataType}}
          />
        </Box>
      </Box>
    </>
  )
}
