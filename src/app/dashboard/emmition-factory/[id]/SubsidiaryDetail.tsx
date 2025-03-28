import {toaster} from '@/components/ui/toaster'
import {getSubsidiaryById} from '@/lib/api/get'
import {ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Flex,
  Text,
  DataList,
  Card,
  Button,
  useDisclosure,
  useDialog
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import {SimpleGrid} from '@chakra-ui/react'
import {EditSubsidiary} from './EditDialog'

const SubsidiaryDetailData = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [subsidiary, setSubsidiary] = useState<ISubsidiary>()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [editedSubsidiary, setEditedSubsidiary] = useState<ISubsidiary | null>(null)

  const {onOpen, onClose} = useDisclosure() // Modal Control

  const center = {lat: 37.5666535, lng: 126.9779692} // Replace with actual coordinates
  const dialog = useDialog()
  const fetchSubsidary = async (id: string) => {
    try {
      const response = await getSubsidiaryById(id)
      setSubsidiary(response.data)
      console.log(response.data)
    } catch (error) {
      toaster.error({
        title: '사업장 데이터를 가져오는 데 실패했습니다.'
      })
    }
  }

  useEffect(() => {
    if (subsidiaryId) {
      fetchSubsidary(subsidiaryId)
    }
  }, [subsidiaryId])
  // 숫자에 쉼표 추가
  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat().format(number)
  }

  function setIsEditing(arg0: boolean): void {
    throw new Error('Function not implemented.')
  }
  return (
    <div>
      <Flex direction="row" justify="space-between" gap={6} mb={8}>
        {/* 사업자 정보 박스 */}
        <Card.Root
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          w="40%"
          borderRadius="lg"
          boxShadow="sm">
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              사업자 정보
            </Text>
          </Card.Title>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>사업자명</DataList.ItemLabel>
                <DataList.ItemValue>{subsidiary?.name || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>

          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>사업장주소</DataList.ItemLabel>
                <DataList.ItemValue>{subsidiary?.address || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>온실가스비용</DataList.ItemLabel>
                <DataList.ItemValue>
                  {subsidiary?.annualEnergyCost
                    ? `${formatNumberWithCommas(subsidiary.annualEnergyCost)}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>사업장수익</DataList.ItemLabel>
                <DataList.ItemValue>
                  {subsidiary?.annualRevenue
                    ? `${formatNumberWithCommas(subsidiary.annualRevenue)}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>사업장자본금</DataList.ItemLabel>
                <DataList.ItemValue>
                  {subsidiary?.capital
                    ? `${formatNumberWithCommas(subsidiary.capital)}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>사업장업종</DataList.ItemLabel>
                <DataList.ItemValue>{subsidiary?.industryType || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>주요생산품</DataList.ItemLabel>
                <DataList.ItemValue>{subsidiary?.mainProducts || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>종업원수</DataList.ItemLabel>
                <DataList.ItemValue>
                  {subsidiary?.numberOfEmployees
                    ? `${formatNumberWithCommas(subsidiary.numberOfEmployees)}명`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>전화번호</DataList.ItemLabel>
                <DataList.ItemValue>{subsidiary?.phoneNumber || '-'}</DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>생산량</DataList.ItemLabel>
                <DataList.ItemValue>
                  {subsidiary?.productionVolume
                    ? `${formatNumberWithCommas(subsidiary.productionVolume)}`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
            {subsidiary && <EditSubsidiary subsidiary={subsidiary} />}
          </Card.Body>
        </Card.Root>
        {/* 기업 정보 박스 */}
        <Card.Root
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          w="60%"
          borderRadius="lg"
          boxShadow="sm">
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              사업장 위치
            </Text>
          </Card.Title>
          <Card.Body>
            <LoadScript googleMapsApiKey="AIzaSyBx0SlxezqTxbd5GhY-GRsJHbrszcVmFqc">
              <GoogleMap
                mapContainerStyle={{width: '100%', height: '400px'}}
                center={center}
                zoom={10}
                onLoad={() => setMapLoaded(true)}>
                {mapLoaded && subsidiary?.address && subsidiary?.address && (
                  <Marker position={center} />
                )}
              </GoogleMap>
            </LoadScript>
          </Card.Body>
        </Card.Root>
      </Flex>
      <SimpleGrid columns={2} columnGap="" rowGap="4">
        <Card.Root p={4}>
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              [사업장약도]
            </Text>
          </Card.Title>
          <Card.Body>
            <Text>
              <img
                src="/route.png"
                alt="route"
                style={{width: '800px', height: '400px'}}
              />{' '}
            </Text>
          </Card.Body>
        </Card.Root>
        <Card.Root p={4}>
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              [사업장사진]
            </Text>
          </Card.Title>
          <Card.Body>
            <Text>
              <img
                src="/processPicture.png"
                alt="processPicture"
                style={{width: '800px', height: '400px'}}
              />{' '}
            </Text>
          </Card.Body>
        </Card.Root>
        <Card.Root p={4}>
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              [시설배치도]
            </Text>
          </Card.Title>
          <Card.Body>
            <Text>
              <img
                src="/arrangementPicture.png"
                alt="arrangementPicture"
                style={{width: '800px', height: '400px'}}
              />{' '}
            </Text>
          </Card.Body>
        </Card.Root>
        <Card.Root p={4}>
          <Card.Title>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={4}>
              [공정도]
            </Text>
          </Card.Title>
          <Card.Body>
            <Text>
              <img
                src="/processPicture.png"
                alt="processPicture"
                style={{width: '800px', height: '400px'}}
              />{' '}
            </Text>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </div>
  )
}

export default SubsidiaryDetailData
