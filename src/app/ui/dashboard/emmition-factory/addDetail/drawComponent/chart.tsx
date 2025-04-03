import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo,
  IMothlyData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {useEffect, useRef} from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  BarElement,
  Scale,
  Tick,
  TooltipItem,
  ChartOptions
} from 'chart.js'
import {LuChevronLeft, LuChevronRight} from 'react-icons/lu'
import {inter} from '@/app/ui/fonts'
import {Line} from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
)

export function ChartforSubsidary({total}: {total: IMothlyData}) {
  const stationData = total.stationary || []
  const mobileData = total.mobile || []
  // const electric = total.electric || []
  // const steam = total.steam || []

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const processedStationData = labels.map((_, index) => stationData[index] || 0)
  const processedMobileData = labels.map((_, index) => mobileData[index] || 0)
  // const processedElectricData = labels.map((_, index) => electric[index] || 0)
  // const processedSteamData = labels.map((_, index) => steam[index] || 0)

  const options: ChartOptions<'line'> = {
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
        text: '온실가스 배출량', // 차트 제목
        font: {
          family: 'Pretendard',
          size: 20,
          weight: 550
        }, // 제목 폰트 설정
        color: 'black', // 제목 색상
        padding: {
          bottom: 10 // 제목과 단위 사이의 간격 조정
        }
      },
      subtitle: {
        display: true,
        align: 'end',
        text: '단위: tCO2eq    ',
        font: {
          family: 'Pretendard',
          size: 12,
          weight: 500
        },
        color: 'grey', // 제목 색상
        padding: {
          bottom: -20 // 제목과 단위 사이의 간격 조정
        }
      }
    },
    scales: {
      y: {
        afterDataLimits: (scale: Scale) => {
          scale.max = scale.max * 1.5
        }
      }
    }
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: '고정연소',
        data: processedStationData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: '이동연소',
        data: processedMobileData,
        fill: false,
        borderColor: '#ABE0AD',
        tension: 0.1
      }
    ]
  }

  return (
    <Box h="250px">
      {/* 차트 크기 조정 */}
      <Line
        options={{
          ...options,
          maintainAspectRatio: false // 차트의 비율을 고정하지 않음
        }}
        data={data}
      />
    </Box>
  )
}
