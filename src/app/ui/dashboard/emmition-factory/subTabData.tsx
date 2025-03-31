import {SelectTypeTab} from '@/lib/api/components/typeTabs'
import {YearSelector} from '@/lib/api/components/yearSelector'
import {useState} from 'react'
import {StationTable} from './addDetail/drawComponent/table'
import {Box, Button, CloseButton, Dialog, Portal, Span} from '@chakra-ui/react'
import {Dataform_Station} from './addDetail/dataform/dataform_Station'
import {Dataform_Mobile} from './addDetail/dataform/dataform_Mobile'

export const TabContentData = ({subsidiaryId}: {subsidiaryId: string}) => {
  const [year, setYear] = useState<string>('2023')
  const [dataType, setDataType] = useState<string>('station')
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      {/* <Dialog.Root size="full" open={open}>
        <Dialog.Trigger asChild onClick={() => setOpen(true)}>
          <Button bg="blue.500">고정 연소</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={() => setOpen(false)} />
              </Dialog.CloseTrigger>
              <Dialog.Header>
                <Dialog.Title />
              </Dialog.Header>
              <Dialog.Body>
                <Dataform_Station
                  subsidaryId={subsidiaryId}
                  onClose={() => setOpen(false)}
                />
              </Dialog.Body>
              <Dialog.Footer />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Span>
        <Dataform_Mobile subsidaryId={subsidiaryId} />
      </Span> */}
      <YearSelector props={{value: year, onValueChange: setYear}} />
      <Box display="flex" justifyContent="space-between">
        <Span>
          <SelectTypeTab props={{value: dataType, onValueChange: setDataType}} />
        </Span>
        <Span>
          <Dataform_Mobile subsidaryId="subsidiaryId" />
          <Button></Button>
        </Span>
      </Box>
      <StationTable
        props={{year: year, subsidiaryId: subsidiaryId, dataType: dataType}}
      />
    </>
  )
}
