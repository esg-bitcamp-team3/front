import React, {useRef} from 'react'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import {HotTable} from '@handsontable/react'

const SpreadsheetInput = () => {
  const hotRef = useRef(null)

  return (
    <HotTable
      ref={hotRef}
      data={[
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]}
      colHeaders={['A', 'B', 'C']}
      rowHeaders={true}
      width="600"
      height="300"
      licenseKey="non-commercial-and-evaluation"
    />
  )
}

export default SpreadsheetInput
