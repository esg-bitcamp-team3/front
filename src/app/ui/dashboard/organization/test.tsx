import NavLinks from '@/app/ui/dashboard/nav-links'
import {Box, Link, Flex, Button, Text, DataList} from '@chakra-ui/react'
import {FiPower} from 'react-icons/fi' // Using react-icons for the power icon

const stats = [
  {label: '기업명', value: '(주)한화에어로스페이스', diff: -12, helpText: '현재까지'},
  {
    label: '매출액',
    value: '￦200,340,008(단위:만원)',
    diff: 12,
    helpText: '지난 30일'
  },
  {label: '법인번호', value: '609-81-02992', diff: 4.5, helpText: '지난 30일'},
  {label: '직원수', value: '5,000명', diff: 8, helpText: '지난 30일'},
  {label: '설립연도', value: '1977년', diff: 2, helpText: '현재까지'},
  {
    label: '지역',
    value: '경상남도 창원시 성산구 창원대로 1204',
    diff: 0,
    helpText: '지난 30일'
  }
]

const subsidiaryStats = [
  {label: '부산사업장', value: '500 톤 CO2'},
  {label: '천안사업장', value: '300 톤 CO2'},
  {label: '대전사업장', value: '500 톤 CO2'},
  {label: '대구사업장', value: '300 톤 CO2'},
  {label: '영주사업장', value: '200 톤 CO2'}
]

const passdataStats = [
  {label: '부산사업장', value: '20%', additionalValue: '(▲20%)'},
  {label: '천안사업장', value: '15%', additionalValue: '(▼15%)'},
  {label: '대전사업장', value: '20%', additionalValue: '(▼15%)'},
  {label: '대구사업장', value: '15%', additionalValue: '(▼15%)'},
  {label: '영주사업장', value: '2%', additionalValue: '(▲20%)'}
]

export const Demo = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* 로고와 환영 텍스트 박스 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        p={1}
        bg="white"
        borderRadius="lg">
        <Link href="/">
          <Button as="a" bg="white" color="green.600" padding={4} borderRadius="lg">
            <img
              src="/gglogo.png"
              alt="Green Gauge Logo"
              style={{width: '55px', height: '55px', marginRight: '14px'}}
            />
            <Text fontSize="3xl" fontWeight="bold">
              Green Gauge에 오신 것을 환영합니다
            </Text>
          </Button>
        </Link>
      </Box>

      {/* 기업 정보와 사업장 정보를 나란히 표시 */}
      <Flex direction="row" justify="space-between" gap={6} mb={8}>
        {/* 기업 정보 박스 */}
        <Box
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          w="48%" // Adjust width for side-by-side layout
          flexGrow={1} // Make this section grow vertically
        >
          <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
            기업 정보
          </Text>
          {stats.map(item => (
            <Box
              key={item.label}
              display="flex"
              justifyContent="space-between"
              width="100%"
              mt={2}>
              <Text fontSize="xl" color="gray.600">
                {item.label}
              </Text>
              <Text fontSize="xl" color="gray.800">
                {item.value}
              </Text>
            </Box>
          ))}
        </Box>

        {/* 사업장 정보 */}
        <Box
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          w="48%" // Adjust width for side-by-side layout
          h="100%"
          flexGrow={1} // This ensures the box grows vertically to fill space
        >
          <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
            사업장정보
          </Text>
          {subsidiaryStats.map(item => (
            <Box
              key={item.label}
              display="flex"
              justifyContent="space-between"
              width="100%"
              mt={2}>
              <Text fontSize="xl" color="gray.600">
                {item.label}
              </Text>
              <Text fontSize="xl" color="gray.800">
                {item.value}
              </Text>
            </Box>
          ))}
        </Box>
      </Flex>

      {/* 목표 감소량 (전년도 증감률) */}
      <Flex direction="row" justify="space-between" gap={6} mb={8}>
        {/* 목표 감소량 박스 */}
        <Box
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          w="48%" // Adjust width for side-by-side layout
        >
          <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
            목표 감소량(전년도 증감률)
          </Text>
          {passdataStats.map(item => (
            <Box
              key={item.label}
              display="flex"
              justifyContent="space-between"
              width="100%"
              mt={2}>
              <Text fontSize="xl" color="gray.600">
                {item.label}
              </Text>
              <Flex direction="row" alignItems="center" gap={4}>
                <Text fontSize="xl" color="gray.800">
                  {item.value}
                </Text>
                <Text fontSize="xl" color="gray.600">
                  {item.additionalValue.includes('▲') ? (
                    <span style={{color: 'red'}}>{item.additionalValue}</span>
                  ) : item.additionalValue.includes('▼') ? (
                    <span style={{color: 'blue'}}>{item.additionalValue}</span>
                  ) : (
                    item.additionalValue
                  )}
                </Text>
              </Flex>
            </Box>
          ))}
        </Box>
      </Flex>

      {/* 푸터 */}
      <Box
        as="footer"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="black"
        color="white"
        p={50}
        borderRadius="lg"
        mt={8}>
        <Text fontSize="lg" textAlign="center">
          <strong>Green Gauge</strong> | 더 나은 세상을 위한 힘
        </Text>
        <Text fontSize="lg" textAlign="center" mt={2}>
          주소: 123 Green St, Eco City, Earth
        </Text>
        <Text fontSize="xs" textAlign="center" mt={1}>
          이메일: contact@greengauge.com | 전화: +123 456 7890
        </Text>
      </Box>
    </Box>
  )
}
