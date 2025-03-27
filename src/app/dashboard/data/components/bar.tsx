import React from 'react'
import {Bar} from 'react-chartjs-2'
import {ChartOptions} from 'chart.js'
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
import {Box} from '@chakra-ui/react'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

const EmissionBar = ({data}: {data: IYearlyEmissionData}) => {
  const years = Object.keys(data).map(Number) // 2020, 2021, 2022, ...
  const stationary = years.map(year => data[year].stationary.toFixed(2))
  const mobile = years.map(year => data[year].mobile.toFixed(2))

  const chartData = {
    labels: years,
    datasets: [
      {
        label: '고정 연소',
        data: stationary,
        backgroundColor: '#36A2EB' // Blue for stationary
      },
      {
        label: '이동 연소',
        data: mobile,
        backgroundColor: '#FF6384' // Red for mobile
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
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
    <Box width="lg">
      <Bar data={chartData} options={options} />
    </Box>
  )
}

export {EmissionBar}
