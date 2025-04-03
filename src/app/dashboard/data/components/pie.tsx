import {IOrganization, IOrganizationData} from '@/lib/api/interfaces/retrieveInterfaces'
import {Box, Center, Color, HStack} from '@chakra-ui/react'
import {ArcElement, ChartOptions, Chart, SubTitle, Title} from 'chart.js'
import {useState} from 'react'
import {Doughnut, Pie} from 'react-chartjs-2'
import Annotation, {DoughnutLabelAnnotationOptions} from 'chartjs-plugin-annotation'
Chart.register(ArcElement, SubTitle, Title, Annotation)

export function PieForOrganization({datas}: {datas: IOrganizationData}) {
  const options: ChartOptions<'doughnut'> = {
    responsive: true, // 반응형 지원
    interaction: {
      mode: 'index', // x축 상의 모든 데이터 포인트에 대해 툴팁 표시
      intersect: false // 마우스가 포인트에 위치하지 않아도 툴팁이 보이도록 설정
    },
    plugins: {
      annotation: {
        annotations: {
          dLabel: {
            type: 'label',
            content: ['Total', `${datas.total}`, '1 year'],
            font: {
              size: 20
            },
            color: 'black',
            position: {
              x: '50%',
              y: '50%'
            },
            textAlign: 'center'
          }
        }
      },
      legend: {
        position: 'left' as const // 범례 위치 설정
      },
      title: {
        display: true, // 제목 표시 여부
        align: 'center', // 제목 정렬 설정
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
          bottom: 0 // 제목과 단위 사이의 간격 조정
        }
      }
    }
  }

  const data = {
    labels: ['Scope1', 'Scope2'],
    datasets: [
      {
        label: '온실가스 배출량',
        data: [datas.scope1, datas.scope2],
        fill: true,
        backgroundColor: ['rgb(75, 192, 192)', '#ABE0AD']
      }
    ]
  }

  return (
    <Center alignContent="center" justifyContent="center" w={'50%'} margin={'auto'}>
      <Doughnut data={data} options={options} />
    </Center>
  )
}
