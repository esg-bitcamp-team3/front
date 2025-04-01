'use client'
import {Doughnut} from 'react-chartjs-2'
import {Bar} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  ChartOptions
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {Box, HStack, SegmentGroup, Text} from '@chakra-ui/react'
import {LuChartColumnBig, LuChartPie, LuTable} from 'react-icons/lu'
import {useState} from 'react'
import {IOrganizationData} from '@/lib/api/interfaces/retrieveInterfaces'

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

const ScopeChart = ({scope1, scope2}: {scope1: number; scope2: number}) => {
  const data = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        data: [scope1, scope2],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'white', // 글자 색상
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value: number) => value.toFixed(0), // 값 표시 형식
        anchor: 'center', // 값 위치
        align: 'center'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return <Doughnut data={data} options={options} />
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
)
const ScopeBarChart = ({scope1, scope2}: {scope1: number; scope2: number}) => {
  const data = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: 'Scope 별 배출량',
        data: [scope1, scope2],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false // 범례 숨기기
      },
      datalabels: {
        color: 'white', // 글자 색상
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value: number) => value.toFixed(0), // 값 표시 형식
        anchor: 'end', // 값 위치
        align: 'top'
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0, // Prevent label rotation
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toString() // Ensure labels are fully visible
          }
        }
      }
    },
    layout: {
      padding: {
        top: 30 // Add padding to prevent labels from being cut off
      }
    }
  }

  return <Bar data={data} options={options} />
}
const ScopeBox = ({data}: {data: IOrganizationData}) => {
  const [value, setValue] = useState<string>('bar')
  console.log('scope1', data.scope1)
  console.log('scope2', data.scope2, data.electric)

  return (
    <Box
      width="md"
      height="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between">
      <HStack justifyContent="space-between">
        <Text textStyle="md" fontWeight="bold">
          Scope별 배출량
        </Text>
        <SegmentGroup.Root
          defaultValue="bar"
          onValueChange={e => setValue(e.value)}
          m={4}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            items={[
              {
                value: 'pie',
                label: (
                  <HStack>
                    <LuChartPie />
                    Pie
                  </HStack>
                )
              },
              {
                value: 'bar',
                label: (
                  <HStack>
                    <LuChartColumnBig />
                    Bar
                  </HStack>
                )
              }
            ]}
            padding={4}
            gap={4}
          />
        </SegmentGroup.Root>
      </HStack>
      {value === 'bar' ? (
        <ScopeBarChart scope1={data.scope1} scope2={data.scope2} />
      ) : (
        <ScopeChart scope1={data.scope1} scope2={data.scope2} />
      )}
    </Box>
  )
}

export {ScopeChart, ScopeBarChart, ScopeBox}
