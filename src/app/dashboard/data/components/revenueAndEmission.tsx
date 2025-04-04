import {
  IOrganizationRevenueByYear,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {Box} from '@chakra-ui/react'
import {
  ChartOptions,
  Scale,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
} from 'chart.js'
import {Bar, Line} from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  PointElement,
  LineElement
)

export const RevenueAndEmission = ({
  emission,
  revenue
}: {
  emission: IYearlyEmissionData
  revenue: IOrganizationRevenueByYear
}) => {
  const years = Object.keys(emission).map(Number) // 2020, 2021, 2022, ...
  const emissionData = years.map(year => emission[year].total)
  const revenueData = years.map(year => revenue[year].revenue / 100000000)

  console.log('emission: ', emissionData)
  console.log('revenue: ', revenueData)

  const options = {
    responsive: true, // 반응형 지원
    interaction: {
      mode: 'index', // x축 상의 모든 데이터 포인트에 대해 툴팁 표시
      intersect: false // 마우스가 포인트에 위치하지 않아도 툴팁이 보이도록 설정
    },
    plugins: {
      legend: {
        position: 'top' as const // 범례 위치 설정
      },
      title: {
        display: true, // 제목 표시 여부
        align: 'center', // 제목 정렬 설정
        text: '온실가스 배출량 & 매출량', // 차트 제목
        font: {
          family: 'Pretendard',
          size: 20
        }, // 제목 폰트 설정
        color: 'black', // 제목 색상
        padding: {
          bottom: 10 // 제목과 단위 사이의 간격 조정
        }
      }
    },
    scales: {
      y1: {
        afterDataLimits: (scale: Scale) => {
          scale.max = scale.max! * 1.2
        },
        position: 'left', // y축 위치 설정
        title: {
          display: true, // y축 제목 표시 여부
          text: '온실가스 배출량 (tCO2eq)', // y축 제목
          font: {
            family: 'Pretendard',
            size: 10
          }
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y2: {
        afterDataLimits: (scale: Scale) => {
          scale.max = scale.max! * 1.2 // y축 최대값 설정
        },
        position: 'right', // y축 위치 설정
        title: {
          display: true, // y축 제목 표시 여부
          text: '매출액 (억원)', // y축 제목
          font: {
            family: 'Pretendard',
            size: 10
          }
        }
      }
    }
  }

  const data = {
    labels: years,
    datasets: [
      {
        label: '총 배출량',
        data: emissionData,
        fill: false,
        borderColor: '#409181',
        backgroundColor: '#409181',
        tension: 0.1,
        yAxisID: 'y1', // y축 설정
        type: 'line'
      },
      {
        label: '매출량',
        data: revenueData,
        fill: false,
        borderColor: '#89f9ba',
        backgroundColor: '#89f9ba',
        tension: 0.5,
        borderWidth: 1,
        yAxisID: 'y2', // y축 설정
        type: 'bar'
      }
    ]
  }

  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" padding={10} w="45vw" h="38vh">
      {/* 차트 크기 조정 */}
      <Line
        options={options}
        data={data} // 데이터 설정
      />
    </Box>
  )
}
