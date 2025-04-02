'use client'

import {ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Flex,
  HStack,
  IconButton,
  Input,
  Separator,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
  useDialog
} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {LuSearch} from 'react-icons/lu'

const SearchBar = ({onSearch}: {onSearch: (query: string) => void}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch(searchQuery)
  }
}

const headers = [
  '사업장명',
  '대표업종',
  '사업장 전화번호',
  '사업장 소재지',
  '주 생산품',
  '생산량'
]

const FactorTable = () => {
  const [factorList, setFactorList] = useState<ISubsidiary[]>([])
  const router = useRouter()

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/emmition-factory/${id}`)
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bold">
          사업장 목록
        </Text>
      </Flex>

      <Separator />
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                fontWeight="bold"
                key={index}
                padding={4}
                borderBottom="2px"
                textAlign="center">
                {header}
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {factorList.length > 0 ? (
            factorList.map(subsidiary => (
              <TableRow
                key={subsidiary._id}
                cursor="pointer"
                onClick={() => handleProjectClick(subsidiary._id)}
                _hover={{backgroundColor: 'gray.200'}}
                borderBottom="1px"
                fontSize="sm">
                <TableCell padding={4} textAlign="center">
                  {subsidiary.name || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.industryType || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.phoneNumber || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.address || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.mainProducts || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.productionVolume !== undefined
                    ? `${subsidiary.productionVolume}${
                        subsidiary.unit ? ' ' + subsidiary.unit : ''
                      }`
                    : '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                프로젝트 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
    </Flex>
  )
}

export {FactorTable}
