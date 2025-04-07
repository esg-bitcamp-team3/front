'use client'

import {useState} from 'react'

import {YearSelector} from '@/lib/api/components/yearSelector'
import {SelectYear} from './graph'
import {Box, Flex, VStack} from '@chakra-ui/react'

const SubsidiaryDetail = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2025')

  return (
    <VStack
      shadow={'md'}
      borderRadius={'lg'}
      p={4}
      gap={20}
      justifyContent={'end'}
      border={'1px solid #E2E8F0'}>
      <Flex justifyContent="end" alignItems="center" width={'full'} padding={4}>
        <YearSelector props={{value: year, onValueChange: setYear}} />
      </Flex>
      <SelectYear props={{subsidiaryId: subsidiaryId, year: year}} />
    </VStack>
  )
}

export default SubsidiaryDetail
