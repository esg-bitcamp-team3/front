import {lusitana} from '@/app/ui/fonts'
import {Heading} from '@chakra-ui/react'
import {redirect} from 'next/navigation'

export default async function Page() {
  redirect('/dashboard/data')
}
