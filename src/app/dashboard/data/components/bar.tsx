import React from 'react'
import {Bar} from 'react-chartjs-2'
import {ChartOptions, SubTitle} from 'chart.js'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import {IYearlyEmissionData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Box, Text, VStack} from '@chakra-ui/react'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, SubTitle)

const EmissionBar = ({data}: {data: IYearlyEmissionData}) => {
  const years = Object.keys(data).map(Number) // 2020, 2021, 2022, ...
  const stationary = years.map(year => data[year].stationary.toFixed(2))
  const mobile = years.map(year => data[year].mobile.toFixed(2))
  const electric = years.map(year => data[year].electric.toFixed(2))
  const steam = years.map(year => data[year].steam.toFixed(2))

  const indirect = years.map((_, index) =>
    (parseFloat(electric[index]) + parseFloat(steam[index])).toFixed(2)
  )

  console.log('indirect: ', indirect)

  const chartData = {
    labels: years,
    datasets: [
      {
        label: '고정연소',
        data: stationary,
        backgroundColor: '#36A2EB' // Blue for stationary
      },
      {
        label: '이동연소',
        data: mobile,
        backgroundColor: '#f9f871' // Red for mobile
      },
      {
        label: '간접연소(전기&스팀)',
        data: indirect,
        backgroundColor: '#2ae8b5' // Blue for stationary
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const // 범례 위치 설정
      },
      title: {
        display: true, // 제목 표시 여부
        align: 'center', // 제목 정렬 설정
        text: '연간 배출량', // 차트 제목
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
        text: '단위: tCO2eq',
        font: {
          family: 'Pretendard',
          size: 12,
          weight: 500
        },
        color: 'grey', // 제목 색상
        padding: {
          bottom: 0 // 제목과 단위 사이의 간격 조정
        }
      }
    },
    scales: {
      x: {
        stacked: true // Stacking the bars
      },
      y: {
        stacked: true, // Stacking the bars
        beginAtZero: true
      }
    }
  }

  return (
    <Box h="250px" alignContent="end">
      <Bar data={chartData} options={options} />
    </Box>
  )
}

export {EmissionBar}
