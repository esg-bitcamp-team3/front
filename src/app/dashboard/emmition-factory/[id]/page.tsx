'use client'

import {use} from 'react'
import SubsidiaryTab from '../tab/SubsidiaryDetailTab'

interface Props {
  params: Promise<{id: string}>
}

const Page = ({params}: Props) => {
  const {id} = use(params)

  return <SubsidiaryTab subsidiaryId={id} />
}

export default Page
