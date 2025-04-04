import {
  ICarbonEmissionGoalsByYear,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {Box} from '@chakra-ui/react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Scale,
  SubTitle,
  Title,
  Tooltip
} from 'chart.js'
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

export const LineChart = ({
  datas,
  goals
}: {
  datas: IYearlyEmissionData
  goals: ICarbonEmissionGoalsByYear
}) => {
  console.log('datas: ', datas)
  console.log('goals: ', goals)
  const years = Object.keys(datas).map(Number) // 2020, 2021, 2022, ...
  const total = years.map(year => datas[year].total.toFixed(2))
  const goal = years.map(year => goals[year].emissionGoal)

  const excessGoal = years.map(year =>
    (datas[year - 1]?.total * (1 - goals[year].emissionGoal / 100)).toFixed(2)
  )

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
        text: '온실가스 배출량 & 감축 목표 배출량', // 차트 제목
        font: {
          family: 'Pretendard',
          size: 20
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
          size: 12
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
          scale.max = scale.max! * 1.5
        }
      }
    }
  }

  const data = {
    labels: years,
    datasets: [
      {
        label: '총 배출량',
        data: total,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: '감축 목표 배출량',
        data: excessGoal,
        fill: false,
        borderColor: '#ABE0AD',
        backgroundColor: '#ABE0AD',
        tension: 0.1
      }
    ]
  }

  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" padding={10} h="100%">
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
