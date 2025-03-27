'use client'

import {Box, Portal, Select, createListCollection} from '@chakra-ui/react'
import {useMemo, useState, useEffect} from 'react'
import {getStationaryCombustion} from '@/lib/api/get'
import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {StationTable} from './addDetail/drawComponent/table'

export const SelectYear = ({subsidiaryId}: {subsidiaryId: string}) => {
  return (
    <>
      <Box>
        <StationTable subsidiaryId={subsidiaryId} />
      </Box>
    </>
  )
}
