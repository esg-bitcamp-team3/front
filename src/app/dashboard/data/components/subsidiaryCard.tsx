import {getCalculatedYearlyEmissionOfSubsidiary, getSubsidiaryById} from '@/lib/api/get'
import {
  IOrganization,
  IOrganizationData,
  ISubsidiary,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Box,
  DataList,
  HStack,
  Progress,
  Separator,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'

interface IEmissionData {
  stationary: number
  mobile: number
  electric: number
  steam: number
  total: number
}

export const SubsidiaryCard = ({
  ids,
  currentYearEmissions
}: {
  ids: string[]
  currentYearEmissions: IOrganizationData
}) => {
  const [emissionData, setEmissionData] = useState<IEmissionData[]>([])
  const [subsidiaryData, setSubsidiaryData] = useState<ISubsidiary[]>([])
  const currentYearEmissionTotal = currentYearEmissions?.total

  const year = new Date().getFullYear()

  const fetchData = async () => {
    try {
      const [yearlyEmissions, subsidiaries] = await Promise.all([
        Promise.all(ids.map(id => getCalculatedYearlyEmissionOfSubsidiary(id))),
        Promise.all(ids.map(id => getSubsidiaryById(id)))
      ])
      const yearlyEmission = yearlyEmissions.map(res => res.data[year])
      const subsidiary = subsidiaries.map(res => res.data)
      console.log('yearlyEmission', yearlyEmission)
      console.log('subsidiary', subsidiary)
      setEmissionData(yearlyEmission)
      setSubsidiaryData(subsidiary)
    } catch (error) {
      console.error('Error fetching subsidiary:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log('emissionData', emissionData)

  const subsidiaryPerOrganization: string[] = emissionData.map(data => {
    return ((data.total / currentYearEmissionTotal) * 100).toFixed(1)
  })

  console.log('subsidiaryPerOrganization', subsidiaryPerOrganization)

  return (
    <Box
      width="100%"
      height="300px"
      borderWidth="1px"
      shadow="lg"
      borderRadius="lg"
      padding={4}
      overflowY="auto">
      <Text textStyle={'xl'} fontWeight={'bold'} padding={4}>
        사업장 별 배출량 비중
      </Text>
      <Table.Root size="sm" padding={4}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader fontWeight={'bold'} padding={4} textAlign={'center'}>
              사업장
            </Table.ColumnHeader>
            <Table.ColumnHeader fontWeight={'bold'} padding={4} textAlign={'center'}>
              비중
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ids.map((id, i) => (
            <Table.Row key={id} padding={4}>
              <Table.Cell padding={4} textAlign={'center'}>
                {subsidiaryData[i]?.name}
              </Table.Cell>
              <Table.Cell padding={4} textAlign="center" justifyContent={'center'}>
                <HStack>
                  {subsidiaryPerOrganization[i]}%
                  <Progress.Root
                    value={parseFloat(subsidiaryPerOrganization[i])}
                    width="100px"
                    height="10px"
                    borderRadius="5px"
                    bg="gray.200">
                    <Progress.Track>
                      <Progress.Range
                        bg="green.400"
                        width={`${subsidiaryPerOrganization[i]}%`}
                      />
                    </Progress.Track>
                  </Progress.Root>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
