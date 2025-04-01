import {IScopeData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Box, Color, HStack} from '@chakra-ui/react'
import {ArcElement, ChartOptions, Chart, SubTitle, Title} from 'chart.js'
import {useState} from 'react'
import {Doughnut, Pie} from 'react-chartjs-2'

Chart.register(ArcElement, SubTitle, Title)

export function PieForOrganization({datas}: {datas: IScopeData}) {
  const options: ChartOptions<'doughnut'> = {
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
        align: 'start', // 제목 정렬 설정
        text: 'Scope별 배출량', // 차트 제목
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
          bottom: -5 // 제목과 단위 사이의 간격 조정
        }
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'start'
      }
    }
  }

  console.log(datas)
  const data = {
    labels: ['고정연소', '이동연소'],
    datasets: [
      {
        label: '온실가스 배출량',
        data: [datas.stationary, datas.mobile],
        fill: false,
        backgroundColor: ['rgb(75, 192, 192)', '#ABE0AD']
      }
    ]
  }

  return (
    <Box width="300px" height="400px">
      <Doughnut data={data} options={options} />
    </Box>
  )
}
