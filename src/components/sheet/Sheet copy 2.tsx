'use client'

import {
  getEmissionDataFromStationaryCombustion,
  getChangeLogsOfEmissionDataFromElectricity,
  getEmissionDataFromElectricity
} from '@/lib/api/get'
import {IEmissionInfo, IChangeLogInfo} from '@/lib/api/interfaces/retrieveInterfaces'
import {useState, useRef, useEffect, KeyboardEvent, MouseEvent, JSX} from 'react'

type CellPosition = {
  row: number
  col: string
}

type SelectionRange = {
  start: CellPosition | null
  end: CellPosition | null
}

// Update the RowData type to include serverId for tracking
type RowData = {
  id: number
  serverId?: string
  facilityName?: string
  total?: number
  uncertainty?: number
  emissionActivity?: string
  activityData?: string
  data1: number
  data2: number
  data3: number
  data4: number
  data5: number
  data6: number
  data7: number
  data8: number
  data9: number
  data10: number
  data11: number
  data12: number
}

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  isSelected: boolean
  onMouseDown: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseOver: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseUp: (e: MouseEvent) => void
  rowIndex: number
  colKey: string
  onKeyDown: (e: KeyboardEvent, rowIndex: number, colKey: string) => void
  serverId?: string
  showDifference?: boolean
  getCellDifference?: (
    rowId: string | undefined,
    colKey: string
  ) => {
    changed: boolean
    originalValue: number | string | null // Update type to allow string
    currentValue: number | string | null // Update type to allow string
    difference: number | null
  }
  getCellChangeLogs?: (rowId: string | undefined, colKey: string) => IChangeLogInfo[]
  getColumnDisplayName?: (colKey: string) => string // Add this missing prop
}

const EditableCell = ({
  value,
  onChange,
  isSelected,
  onMouseDown,
  onMouseOver,
  onMouseUp,
  rowIndex,
  colKey,
  onKeyDown,
  serverId,
  showDifference = true,
  getCellDifference,
  getCellChangeLogs,
  getColumnDisplayName
}: EditableCellProps) => {
  const cellRef = useRef<HTMLInputElement>(null)
  const [showHistoryPopup, setShowHistoryPopup] = useState<boolean>(false)

  // Get difference data
  const difference =
    serverId && getCellDifference ? getCellDifference(serverId, colKey) : null
  const hasChanged = difference && difference.changed

  // Get change logs for this cell
  const cellChangeLogs =
    serverId && getCellChangeLogs ? getCellChangeLogs(serverId, colKey) : []
  const hasChangeLogs = cellChangeLogs.length > 0

  // Format the display value to show differences inline
  const displayValue = (): string => {
    if (!showDifference || !hasChanged || !difference) return value

    // For numeric cells, show the difference inline
    if (!isNaN(Number(value)) && difference.difference !== null) {
      const sign = difference.difference > 0 ? '+' : ''
      return `${value} (${sign}${difference.difference})`
    }

    return value
  }

  // Format tooltip to include both difference and change history
  const getTooltip = (): string => {
    let tooltip = hasChanged && difference ? `원본 값: ${difference.originalValue}` : ''

    if (hasChangeLogs) {
      tooltip += tooltip ? '\n\n변경 이력:\n' : '변경 이력:\n'
      tooltip += '(클릭하여 상세보기)'
    }

    return tooltip
  }

  // Get cell style based on state
  const getCellStyle = () => {
    return {
      width: '100%',
      padding: '5px',
      backgroundColor: isSelected ? '#e0e0ff' : hasChangeLogs ? '#fff8e8' : 'white',
      color: showDifference && hasChanged ? getChangeColor() : 'inherit',
      fontWeight: showDifference && hasChanged ? 'bold' : 'normal',
      outline: isSelected
        ? '2px solid blue'
        : hasChangeLogs
        ? '1px dashed #ff9800'
        : 'none',
      position: 'relative' as const
    }
  }

  // Determine color based on change direction
  const getChangeColor = () => {
    if (!hasChanged || !difference) return undefined
    return difference.difference !== null && difference.difference > 0
      ? '#4CAF50'
      : '#f44336' // Green for increase, red for decrease
  }

  useEffect(() => {
    if (isSelected && cellRef.current) {
      cellRef.current.focus()

      // When cell gets focus and has a formatted display value,
      // select just the actual value part for easier editing
      if (hasChanged && cellRef.current.value.includes('(')) {
        // Select just the number part, before the parenthesis
        const endPos = cellRef.current.value.indexOf(' (')
        cellRef.current.setSelectionRange(0, endPos)
      }
    }
  }, [isSelected, hasChanged])

  // Handle focus to switch between display and edit modes
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (hasChanged && e.target.value.includes('(')) {
      // When focusing, show just the raw value
      const rawValue = value
      e.target.value = rawValue
      e.target.select()
    }
  }

  // Handle blur to restore the formatted display
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // When leaving, restore the formatted value if it hasn't changed
    if (hasChanged && e.target.value === value) {
      e.target.value = displayValue()
    }
  }

  return (
    <div style={{position: 'relative', width: '100%'}}>
      <input
        ref={cellRef}
        type="text"
        value={isSelected ? value : displayValue()}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={e => onMouseDown(e, rowIndex, colKey)}
        onMouseOver={e => onMouseOver(e, rowIndex, colKey)}
        onMouseUp={e => onMouseUp(e)}
        onKeyDown={e => onKeyDown(e, rowIndex, colKey)}
        style={getCellStyle()}
        title={getTooltip()}
        onClick={() => hasChangeLogs && showDifference && setShowHistoryPopup(true)}
      />

      {/* Enhanced change history indicator with count */}
      {hasChangeLogs && showDifference && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(255, 152, 0, 0.8)',
            color: 'white',
            fontSize: '10px',
            padding: '1px 4px',
            borderBottomLeftRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setShowHistoryPopup(true)}>
          {cellChangeLogs.length}
        </div>
      )}

      {/* Change history popup when clicked */}
      {showHistoryPopup && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            zIndex: 100,
            minWidth: '250px',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
            <strong>
              {getColumnDisplayName ? getColumnDisplayName(colKey) : colKey} 변경 이력
              {hasChangeLogs ? ` (총 ${cellChangeLogs.length}건)` : ''}
            </strong>
            <span style={{cursor: 'pointer'}} onClick={() => setShowHistoryPopup(false)}>
              ✕
            </span>
          </div>

          <div style={{maxHeight: '200px', overflowY: 'auto'}}>
            {cellChangeLogs
              .sort((a, b) =>
                b.modifiedAt ? b.modifiedAt.localeCompare(a.modifiedAt || '') : 0
              )
              .map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: '5px',
                    borderBottom:
                      index < cellChangeLogs.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                  <div style={{fontSize: '11px', color: '#666'}}>
                    {log.modifiedAt
                      ? new Date(log.modifiedAt).toLocaleString('ko-KR')
                      : '날짜 정보 없음'}
                    {' • '}
                    {log.modifiedBy ? log.modifiedBy.name : '알 수 없음'}
                  </div>
                  <div style={{marginTop: '3px'}}>
                    <span style={{textDecoration: 'line-through', color: '#f44336'}}>
                      {log.oldValue}
                    </span>
                    {' → '}
                    <span style={{fontWeight: 'bold', color: '#4CAF50'}}>
                      {log.newValue}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Spreadsheet = () => {
  // Add state to store all emission IDs
  const [emissionDataIds, setEmissionDataIds] = useState<string[]>([])

  const [data, setData] = useState<RowData[]>([])

  // Add history state for undo functionality
  const [history, setHistory] = useState<RowData[][]>([])
  const [redoHistory, setRedoHistory] = useState<RowData[][]>([])

  // Add a new state for undo feedback
  const [undoPerformed, setUndoPerformed] = useState<boolean>(false)

  // Add a new state for redo feedback
  const [redoPerformed, setRedoPerformed] = useState<boolean>(false)

  const [selection, setSelection] = useState<SelectionRange>({
    start: null,
    end: null
  })

  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [clipboard, setClipboard] = useState<string[][]>([])

  // Add inside Spreadsheet component, after other state declarations
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // Update the type of originalData
  const [originalData, setOriginalData] = useState<Record<string, IEmissionInfo>>({})
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set())
  const [deletedRows, setDeletedRows] = useState<Set<string>>(new Set())

  // Add function to submit changes to server
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Add this new state to track whether we're showing original differences
  const [showOriginalDiff, setShowOriginalDiff] = useState<boolean>(false)

  // Add state for change logs
  const [changeLogs, setChangeLogs] = useState<IChangeLogInfo[]>([])
  const [isLoadingChangeLogs, setIsLoadingChangeLogs] = useState<boolean>(false)

  // Update handleSubmitChanges to use the new schema format
  const handleSubmitChanges = async (): Promise<void> => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // // Prepare modified rows data for PATCH request
      // if (modifiedRows.size > 0) {
      //   const modifiedData = data
      //     .filter(row => row.serverId && modifiedRows.has(row.serverId))
      //     .map(row => {
      //       const id = row.serverId
      //       // Create an object with the new schema format
      //       return {
      //         id,
      //         data1: Number(row.col1 || 0),
      //         data2: Number(row.col2 || 0),
      //         data3: Number(row.col3 || 0),
      //         data4: Number(row.col4 || 0),
      //         data5: Number(row.col5 || 0),
      //         data6: Number(row.col6 || 0),
      //         data7: Number(row.col7 || 0),
      //         data8: Number(row.col8 || 0),
      //         data9: Number(row.col9 || 0),
      //         data10: Number(row.col10 || 0),
      //         data11: Number(row.col11 || 0),
      //         data12: Number(row.col12 || 0),
      //         total: Number(row.total || 0),
      //         uncertainty: Number(row.uncertainty || 0),
      //         facilityName: row.facilityName
      //       }
      //     })

      //   // Send PATCH request
      //   await fetch('/api/data', {
      //     method: 'PATCH',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(modifiedData)
      //   })
      // }

      // // Send DELETE requests for deleted rows (unchanged)
      // if (deletedRows.size > 0) {
      //   const deleteIds = Array.from(deletedRows)

      //   await fetch('/api/data/delete', {
      //     method: 'DELETE',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ids: deleteIds})
      //   })
      // }

      // // Clear tracking after successful save
      // setModifiedRows(new Set())
      // setDeletedRows(new Set())
      // setSaveSuccess(true)
      // setTimeout(() => setSaveSuccess(false), 3000)

      // // Update our originalData with current state
      // const newOriginalData: Record<string, Record<string, number | string>> = {}
      // data.forEach(row => {
      //   if (row.serverId) {
      //     newOriginalData[row.serverId] = {
      //       data1: Number(row.col1 || 0),
      //       data2: Number(row.col2 || 0),
      //       data3: Number(row.col3 || 0),
      //       data4: Number(row.col4 || 0),
      //       data5: Number(row.col5 || 0),
      //       data6: Number(row.col6 || 0),
      //       data7: Number(row.col7 || 0),
      //       data8: Number(row.col8 || 0),
      //       data9: Number(row.col9 || 0),
      //       data10: Number(row.col10 || 0),
      //       data11: Number(row.col11 || 0),
      //       data12: Number(row.col12 || 0),
      //       total: Number(row.total || 0),
      //       uncertainty: Number(row.uncertainty || 0),
      //       facilityName: row.facilityName || ''
      //     }
      //   }
      // })
      // setOriginalData(newOriginalData)
    } catch (error) {
      console.error('Error saving changes:', error)
      setSaveError('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Define column names for consistency
  const columnNames = [
    'data1', // 1월
    'data2', // 2월
    'data3', // 3월
    'data4', // 4월
    'data5', // 5월
    'data6', // 6월
    'data7', // 7월
    'data8', // 8월
    'data9', // 9월
    'data10', // 10월
    'data11', // 11월
    'data12' // 12월
  ]

  // Update the data fetching and transformation
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await getEmissionDataFromElectricity({
          id: '67e4cd11523dba9aa704a577'
        })
        const result = await response.data

        // Extract and save all emission data IDs
        const allIds = result
          .map((item: IEmissionInfo) => item._id)
          .filter((id): id is string => !!id)
        setEmissionDataIds(allIds)

        // Store original data for comparison
        const originalServerData: Record<string, IEmissionInfo> = {}
        result.forEach((item: IEmissionInfo) => {
          if (item._id) {
            originalServerData[item._id] = item
          }
        })
        setOriginalData(originalServerData)

        // Transform data into spreadsheet format
        const transformedData = result.map((item: IEmissionInfo, index: number) => {
          const rowData: RowData = {
            id: index,
            data1: item.data1 || 0,
            data2: item.data2 || 0,
            data3: item.data3 || 0,
            data4: item.data4 || 0,
            data5: item.data5 || 0,
            data6: item.data6 || 0,
            data7: item.data7 || 0,
            data8: item.data8 || 0,
            data9: item.data9 || 0,
            data10: item.data10 || 0,
            data11: item.data11 || 0,
            data12: item.data12 || 0,
            facilityName: item.facilityName,
            total: item.total,
            uncertainty: item.uncertainty,
            emissionActivity: item.emissionActivity,
            activityData: item.activityData?._id,
            serverId: item._id
          }

          return rowData
        })
        console.log(transformedData)

        setData(transformedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Limit history size to prevent memory issues
  const MAX_HISTORY_SIZE = 50
  const saveToHistory = (): void => {
    setHistory(prev => {
      const newHistory = [...prev, JSON.parse(JSON.stringify(data))]
      return newHistory.length > MAX_HISTORY_SIZE
        ? newHistory.slice(-MAX_HISTORY_SIZE)
        : newHistory
    })
  }

  // Function to handle undo
  const handleUndo = (): void => {
    if (history.length > 0) {
      const prevState = history[history.length - 1]
      // Store current state in redoHistory before undoing
      setRedoHistory(prev => [...prev, JSON.parse(JSON.stringify(data))])
      setData(prevState)
      setHistory(prev => prev.slice(0, -1))
      // Add visual feedback for the undo action
      setUndoPerformed(true)
      setTimeout(() => setUndoPerformed(false), 500)
    }
  }

  // Add a new function to handle redo
  const handleRedo = (): void => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1]
      // Store current state in history before redoing
      setHistory(prev => [...prev, JSON.parse(JSON.stringify(data))])
      setData(nextState)
      setRedoHistory(prev => prev.slice(0, -1))
      // Add visual feedback for the redo action
      setRedoPerformed(true)
      setTimeout(() => setRedoPerformed(false), 500)
    }
  }

  // Update handleCellChange to track modified rows
  const handleCellChange = (
    rowIndex: number,
    columnKey: string,
    newValue: string
  ): void => {
    saveToHistory()
    const updatedData = [...data]
    updatedData[rowIndex] = {...updatedData[rowIndex], [columnKey]: newValue}

    // Track the modified row by serverId
    const serverId = updatedData[rowIndex].serverId
    if (serverId) {
      setModifiedRows(prev => new Set(prev).add(serverId))
    }

    setData(updatedData)
  }

  // Add function to delete a row
  const handleDeleteRow = (rowIndex: number): void => {
    saveToHistory()

    // Get serverId before removing the row
    const serverId = data[rowIndex].serverId

    // Track deleted row if it has a serverId
    if (serverId) {
      // If it was marked as modified, remove that mark
      if (modifiedRows.has(serverId)) {
        setModifiedRows(prev => {
          const newSet = new Set(prev)
          newSet.delete(serverId)
          return newSet
        })
      }

      // Mark as deleted
      setDeletedRows(prev => new Set(prev).add(serverId))
    }

    // Remove the row from data
    const updatedData = data.filter((_, index) => index !== rowIndex)
    setData(updatedData)
  }

  const handleMouseDown = (
    e: React.MouseEvent,
    rowIndex: number,
    colKey: string
  ): void => {
    e.preventDefault()
    setIsSelecting(true)

    // Set both start and end of selection to this cell initially
    const newSelection: SelectionRange = {
      start: {row: rowIndex, col: colKey},
      end: {row: rowIndex, col: colKey}
    }

    setSelection(newSelection)
  }

  const handleMouseOver = (
    e: React.MouseEvent,
    rowIndex: number,
    colKey: string
  ): void => {
    if (isSelecting && selection.start) {
      setSelection({
        ...selection,
        end: {row: rowIndex, col: colKey}
      })
    }
  }

  const handleMouseUp = (e: React.MouseEvent): void => {
    setIsSelecting(false)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colKey: string
  ): void => {
    // Use the full columnNames array instead of hardcoded ['col1', 'col2']
    const colIndex = columnNames.indexOf(colKey)

    switch (e.key) {
      case 'ArrowRight':
        if (colIndex < columnNames.length - 1) {
          // Move to the next column
          setSelection({
            start: {row: rowIndex, col: columnNames[colIndex + 1]},
            end: {row: rowIndex, col: columnNames[colIndex + 1]}
          })
        }
        break

      case 'ArrowLeft':
        if (colIndex > 0) {
          // Move to the previous column
          setSelection({
            start: {row: rowIndex, col: columnNames[colIndex - 1]},
            end: {row: rowIndex, col: columnNames[colIndex - 1]}
          })
        }
        break

      case 'ArrowUp':
        if (rowIndex > 0) {
          // Move to the cell above
          setSelection({
            start: {row: rowIndex - 1, col: colKey},
            end: {row: rowIndex - 1, col: colKey}
          })
        }
        break

      case 'ArrowDown':
      case 'Enter':
        if (rowIndex < data.length - 1) {
          // Move to the cell below
          setSelection({
            start: {row: rowIndex + 1, col: colKey},
            end: {row: rowIndex + 1, col: colKey}
          })
        }
        break

      case 'Tab':
        e.preventDefault()
        if (!e.shiftKey && colIndex < columnNames.length - 1) {
          // Tab: move right
          setSelection({
            start: {row: rowIndex, col: columnNames[colIndex + 1]},
            end: {row: rowIndex, col: columnNames[colIndex + 1]}
          })
        } else if (!e.shiftKey && rowIndex < data.length - 1) {
          // Tab at end of row: move to first column of next row
          setSelection({
            start: {row: rowIndex + 1, col: columnNames[0]},
            end: {row: rowIndex + 1, col: columnNames[0]}
          })
        } else if (e.shiftKey && colIndex > 0) {
          // Shift+Tab: move left
          setSelection({
            start: {row: rowIndex, col: columnNames[colIndex - 1]},
            end: {row: rowIndex, col: columnNames[colIndex - 1]}
          })
        } else if (e.shiftKey && rowIndex > 0) {
          // Shift+Tab at beginning of row: move to last column of previous row
          setSelection({
            start: {row: rowIndex - 1, col: columnNames[columnNames.length - 1]},
            end: {row: rowIndex - 1, col: columnNames[columnNames.length - 1]}
          })
        }
        break
    }
  }

  // Update isCellSelected function
  const isCellSelected = (rowIndex: number, colKey: string): boolean => {
    if (!selection.start || !selection.end) return false

    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    // Special handling for non-data columns
    const allColumnOrder = [
      'facilityName',
      'emissionActivity',
      ...columnNames,
      'total',
      'uncertainty'
    ]

    const startColIndex = allColumnOrder.indexOf(selection.start.col)
    const endColIndex = allColumnOrder.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const currentColIndex = allColumnOrder.indexOf(colKey)

    return (
      rowIndex >= startRow &&
      rowIndex <= endRow &&
      currentColIndex >= minColIndex &&
      currentColIndex <= maxColIndex
    )
  }

  // Copy selected cells to clipboard
  // Copy selected cells to clipboard
  const copySelectedCells = (): void => {
    if (!selection.start || !selection.end) return

    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    // Use the all-columns array for comprehensive selection
    const allColumnOrder = [
      'facilityName',
      'emissionActivity',
      ...columnNames,
      'total',
      'uncertainty'
    ]

    const startColIndex = allColumnOrder.indexOf(selection.start.col)
    const endColIndex = allColumnOrder.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const copiedData: string[][] = []

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      const rowData: string[] = []
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const colKey = allColumnOrder[colIndex]
        rowData.push(String(data[rowIndex][colKey as keyof RowData] || ''))
      }
      copiedData.push(rowData)
    }

    setClipboard(copiedData)
  }

  // Cut selected cells (copy + remove)
  const cutSelectedCells = (): void => {
    if (!selection.start || !selection.end) return

    // First copy the selected cells
    copySelectedCells()

    // Save current state to history
    saveToHistory()

    // Then clear the selected cells
    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    const startColIndex = columnNames.indexOf(selection.start.col)
    const endColIndex = columnNames.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const updatedData = [...data]

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const colKey = columnNames[colIndex]
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          [colKey]: ''
        }
      }
    }

    setData(updatedData)
  }

  // Paste clipboard content starting at the selection start
  const pasteClipboardContent = (): void => {
    if (!selection.start || clipboard.length === 0) return

    // Save current state to history
    saveToHistory()

    const {row: startRow, col: startCol} = selection.start
    const startColIndex = columnNames.indexOf(startCol)

    const updatedData = [...data]

    clipboard.forEach((rowData, rowOffset) => {
      const targetRowIndex = startRow + rowOffset

      // Skip if we're past the end of the data
      if (targetRowIndex >= data.length) return

      rowData.forEach((cellValue, colOffset) => {
        const targetColIndex = startColIndex + colOffset

        // Skip if we're past the last column
        if (targetColIndex >= columnNames.length) return

        const targetColKey = columnNames[targetColIndex]
        updatedData[targetRowIndex] = {
          ...updatedData[targetRowIndex],
          [targetColKey]: cellValue
        }
      })
    })

    setData(updatedData)
  }

  // Handle keyboard events for copy, cut, paste, undo, and redo
  useEffect(() => {
    const keyHandler = (e: globalThis.KeyboardEvent): void => {
      // Copy with Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        copySelectedCells()
        e.preventDefault()
      }

      // Cut with Ctrl+X or Cmd+X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        cutSelectedCells()
        e.preventDefault()
      }

      // Paste with Ctrl+V or Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteClipboardContent()
        e.preventDefault()
      }

      // Undo with Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        handleUndo()
        e.preventDefault()
      }

      // Redo with Ctrl+Y or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        handleRedo()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', keyHandler as EventListener)

    return () => {
      document.removeEventListener('keydown', keyHandler as EventListener)
    }
  }, [selection, clipboard, data, history, redoHistory])

  // Add this function in the Spreadsheet component
  // Update the getCellDifference function
  const getCellDifference = (
    rowId: string | undefined,
    colKey: string
  ): {
    changed: boolean
    originalValue: number | string | null
    currentValue: number | string | null
    difference: number | null
  } => {
    // Default return value
    const defaultResult = {
      changed: false,
      originalValue: null,
      currentValue: null,
      difference: null
    }

    if (!rowId) return defaultResult

    // Find the current row by serverId
    const currentRow = data.find(row => row.serverId === rowId)
    if (!currentRow) return defaultResult

    // Get the current value
    const currentValue = currentRow[colKey as keyof RowData]

    // Get the original value from originalData
    const originalDataObject = originalData[rowId]
    if (!originalDataObject) return defaultResult

    // Get the original value
    const originalValue = (() => {
      switch (colKey) {
        case 'data1':
          return originalDataObject.data1 || 0
        case 'data2':
          return originalDataObject.data2 || 0
        case 'data3':
          return originalDataObject.data3 || 0
        case 'data4':
          return originalDataObject.data4 || 0
        case 'data5':
          return originalDataObject.data5 || 0
        case 'data6':
          return originalDataObject.data6 || 0
        case 'data7':
          return originalDataObject.data7 || 0
        case 'data8':
          return originalDataObject.data8 || 0
        case 'data9':
          return originalDataObject.data9 || 0
        case 'data10':
          return originalDataObject.data10 || 0
        case 'data11':
          return originalDataObject.data11 || 0
        case 'data12':
          return originalDataObject.data12 || 0
        case 'facilityName':
          return originalDataObject.facilityName || ''
        case 'total':
          return originalDataObject.total || 0
        case 'uncertainty':
          return originalDataObject.uncertainty || 0
        case 'emissionActivity':
          return originalDataObject.emissionActivity || ''
        case 'activityData':
          return originalDataObject.activityData?._id || ''
        default:
          return null
      }
    })()

    // For numeric values, calculate difference
    let difference = null
    if (typeof currentValue === 'number' && typeof originalValue === 'number') {
      difference = currentValue - originalValue
    }

    // Return the comparison result
    return {
      changed: currentValue !== originalValue,
      originalValue,
      currentValue: currentValue !== undefined ? currentValue : null,
      difference
    }
  }

  // Update the getCellChangeLogs function to handle array data changes
  const getCellChangeLogs = (
    rowId: string | undefined,
    colKey: string
  ): IChangeLogInfo[] => {
    if (!rowId) return []

    // Map column key to schema field name
    let fieldName: string
    if (colKey.match(/^col(\d+)$/)) {
      // For columns col1-col12, map to data1-data12
      const monthNumber = colKey.replace('col', '')
      fieldName = `data${monthNumber}`
    } else {
      // For other fields, use the column key directly
      fieldName = colKey
    }

    // Filter change logs for this specific field
    return changeLogs.filter(log => log.entityId === rowId && log.fieldName === fieldName)
  }

  // Add a utility function to map column names to user-friendly display names
  const getColumnDisplayName = (colKey: string): string => {
    const displayNameMap: Record<string, string> = {
      facilityName: '시설명',
      emissionActivity: '배출 활동',
      activityData: '활동 데이터',
      total: '합계',
      uncertainty: '불확도',
      data1: '1월',
      data2: '2월',
      data3: '3월',
      data4: '4월',
      data5: '5월',
      data6: '6월',
      data7: '7월',
      data8: '8월',
      data9: '9월',
      data10: '10월',
      data11: '11월',
      data12: '12월'
    }

    return displayNameMap[colKey] || colKey
  }

  // Add a function to toggle the difference view
  const toggleOriginalDiffView = async () => {
    const newValue = !showOriginalDiff
    setShowOriginalDiff(newValue)

    // If turning on diff view and we don't have change logs yet, fetch them
    if (newValue && changeLogs.length === 0 && emissionDataIds.length > 0) {
      try {
        setIsLoadingChangeLogs(true)

        // Create an array to hold all change logs
        let allChangeLogs: IChangeLogInfo[] = []

        // Fetch change logs for each emission data ID
        for (const emissionId of emissionDataIds) {
          try {
            const response = await getChangeLogsOfEmissionDataFromElectricity({
              id: emissionId
            })

            // Add these logs to our collection
            if (response.data && Array.isArray(response.data)) {
              allChangeLogs = [...allChangeLogs, ...response.data]
            }
          } catch (idError) {
            console.error(`Error fetching logs for ID ${emissionId}:`, idError)
            // Continue with other IDs even if one fails
          }
        }

        // Sort all logs by date (newest first)
        allChangeLogs.sort((a, b) =>
          b.modifiedAt ? b.modifiedAt.localeCompare(a.modifiedAt || '') : 0
        )

        setChangeLogs(allChangeLogs)
      } catch (error) {
        console.error('Error fetching change logs:', error)
      } finally {
        setIsLoadingChangeLogs(false)
      }
    }
  }

  // Add a function to render a summary of all changes from original data
  const renderOriginalChangesSummary = (): JSX.Element | null => {
    // Count how many cells have changes from original data
    let changedCellCount = 0

    // Check each cell in each row for changes
    data.forEach(row => {
      if (!row.serverId) return

      columnNames.forEach(col => {
        const diff = getCellDifference(row.serverId, col)
        if (diff.changed) changedCellCount++
      })
    })

    if (changedCellCount === 0) {
      return (
        <div
          style={{
            padding: '15px',
            textAlign: 'center',
            color: '#666'
          }}>
          원본 데이터와 차이가 없습니다.
        </div>
      )
    }

    return (
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          background: '#f9f9f9'
        }}>
        <h3 style={{margin: '0 0 10px 0'}}>
          원본 데이터 대비 변경사항 ({changedCellCount}건)
        </h3>

        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign: 'left', padding: '5px'}}>시설명</th>
              <th style={{textAlign: 'left', padding: '5px'}}>필드</th>
              <th style={{textAlign: 'right', padding: '5px'}}>원본 값</th>
              <th style={{textAlign: 'right', padding: '5px'}}>현재 값</th>
              <th style={{textAlign: 'right', padding: '5px'}}>차이</th>
            </tr>
          </thead>
          <tbody>
            {data
              .map(row => {
                if (!row.serverId) return null

                return columnNames
                  .map(col => {
                    const diff = getCellDifference(row.serverId, col)
                    if (!diff.changed) return null

                    return (
                      <tr key={`${row.serverId}-${col}`}>
                        <td style={{padding: '5px'}}>
                          {row.facilityName || '(이름 없음)'}
                        </td>
                        <td style={{padding: '5px'}}>{getColumnDisplayName(col)}</td>
                        <td style={{textAlign: 'right', padding: '5px'}}>
                          {diff.originalValue}
                        </td>
                        <td style={{textAlign: 'right', padding: '5px'}}>
                          {diff.currentValue}
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            padding: '5px',
                            color:
                              diff.difference && diff.difference > 0
                                ? '#4CAF50'
                                : '#f44336',
                            fontWeight: 'bold'
                          }}>
                          {diff.difference && diff.difference > 0 ? '+' : ''}
                          {diff.difference}
                        </td>
                      </tr>
                    )
                  })
                  .filter(Boolean)
              })
              .flat()
              .filter(Boolean)}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div tabIndex={0}>
      {isLoading ? (
        <div style={{padding: '20px', textAlign: 'center'}}>Loading data...</div>
      ) : (
        <>
          {undoPerformed && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                background: '#4CAF50',
                color: 'white',
                borderRadius: '3px',
                opacity: 0.9
              }}>
              Action undone
            </div>
          )}
          {redoPerformed && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                background: '#2196F3',
                color: 'white',
                borderRadius: '3px',
                opacity: 0.9
              }}>
              Action redone
            </div>
          )}
          {saveSuccess && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                background: '#4CAF50',
                color: 'white',
                borderRadius: '3px',
                opacity: 0.9
              }}>
              Changes saved successfully
            </div>
          )}
          {saveError && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                background: '#f44336',
                color: 'white',
                borderRadius: '3px',
                opacity: 0.9
              }}>
              {saveError}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
            <h2 style={{margin: 0}}>배출량 데이터</h2>
            <button
              onClick={toggleOriginalDiffView}
              disabled={isLoadingChangeLogs}
              style={{
                backgroundColor: showOriginalDiff ? '#3f51b5' : '#e0e0e0',
                color: showOriginalDiff ? 'white' : 'black',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoadingChangeLogs ? 'wait' : 'pointer'
              }}>
              {isLoadingChangeLogs
                ? '변경 기록 불러오는 중...'
                : showOriginalDiff
                ? '원본 비교 숨기기'
                : '이전 변경사항 보기'}
            </button>
          </div>

          {showOriginalDiff && renderOriginalChangesSummary()}

          <div style={{overflowX: 'auto'}}>
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                border: showOriginalDiff ? '2px solid #3f51b5' : '1px solid #ddd'
              }}>
              <thead>
                <tr style={{backgroundColor: showOriginalDiff ? '#e8eaf6' : '#f5f5f5'}}>
                  <th>시설명</th>
                  <th>배출활동</th>
                  {/* Monthly columns */}
                  {columnNames.map(col => (
                    <th key={col}>{getColumnDisplayName(col)}</th>
                  ))}
                  <th>합계</th>
                  <th>불확도</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor:
                        row.serverId && modifiedRows.has(row.serverId)
                          ? '#fff8e1'
                          : 'white'
                    }}>
                    {/* Facility name */}
                    <td>
                      <EditableCell
                        value={String(row.facilityName || '')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'facilityName', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'facilityName')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="facilityName"
                        onKeyDown={handleKeyDown}
                        serverId={row.serverId}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={
                          showOriginalDiff ? getCellChangeLogs : undefined
                        }
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </td>

                    {/* Emission activity */}
                    <td>
                      <EditableCell
                        value={String(row.emissionActivity || '')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'emissionActivity', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'emissionActivity')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="emissionActivity"
                        onKeyDown={handleKeyDown}
                        serverId={row.serverId}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={
                          showOriginalDiff ? getCellChangeLogs : undefined
                        }
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </td>

                    {/* Monthly data cells - use the direct data property names */}
                    {columnNames.map(col => (
                      <td key={`${row.id}-${col}`}>
                        <EditableCell
                          value={String(row[col as keyof RowData] || '0')}
                          onChange={newValue => handleCellChange(rowIndex, col, newValue)}
                          isSelected={isCellSelected(rowIndex, col)}
                          onMouseDown={handleMouseDown}
                          onMouseOver={handleMouseOver}
                          onMouseUp={handleMouseUp}
                          rowIndex={rowIndex}
                          colKey={col}
                          onKeyDown={handleKeyDown}
                          serverId={row.serverId}
                          showDifference={showOriginalDiff}
                          getCellDifference={getCellDifference}
                          getCellChangeLogs={
                            showOriginalDiff ? getCellChangeLogs : undefined
                          }
                          getColumnDisplayName={getColumnDisplayName}
                        />
                      </td>
                    ))}

                    {/* Total and uncertainty */}
                    <td>
                      <EditableCell
                        value={String(row.total || '0')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'total', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'total')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="total"
                        onKeyDown={handleKeyDown}
                        serverId={row.serverId}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={
                          showOriginalDiff ? getCellChangeLogs : undefined
                        }
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={String(row.uncertainty || '0')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'uncertainty', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'uncertainty')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={handleMouseOver}
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="uncertainty"
                        onKeyDown={handleKeyDown}
                        serverId={row.serverId}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={
                          showOriginalDiff ? getCellChangeLogs : undefined
                        }
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        onClick={() => handleDeleteRow(rowIndex)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '3px 8px'
                        }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add a section to show all change history */}
          {showOriginalDiff && changeLogs.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                border: '1px solid #ff9800',
                borderRadius: '4px',
                background: '#fff8e8'
              }}>
              <h3 style={{margin: '0 0 10px 0', color: '#e65100'}}>전체 변경 이력</h3>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left', padding: '5px'}}>날짜</th>
                    <th style={{textAlign: 'left', padding: '5px'}}>필드</th>
                    <th style={{textAlign: 'left', padding: '5px'}}>수정자</th>
                    <th style={{textAlign: 'right', padding: '5px'}}>이전 값</th>
                    <th style={{textAlign: 'right', padding: '5px'}}>변경된 값</th>
                  </tr>
                </thead>
                <tbody>
                  {changeLogs.map((log, index) => {
                    // Update this line to handle dataX format instead of data.X
                    let displayFieldName = log.fieldName

                    // Check if it's a data field (e.g., "data1", "data2")
                    const dataFieldMatch = log.fieldName.match(/data(\d+)/)
                    if (dataFieldMatch) {
                      const monthNum = dataFieldMatch[1]
                      displayFieldName = `${monthNum}월`
                    } else {
                      // For other common fields, provide nice display names
                      if (log.fieldName === 'facilityName') displayFieldName = '시설명'
                      if (log.fieldName === 'total') displayFieldName = '합계'
                      if (log.fieldName === 'uncertainty') displayFieldName = '불확도'
                    }

                    return (
                      <tr key={index}>
                        <td style={{padding: '5px'}}>
                          {log.modifiedAt
                            ? new Date(log.modifiedAt).toLocaleString('ko-KR')
                            : '날짜 정보 없음'}
                        </td>
                        <td style={{padding: '5px'}}>{displayFieldName}</td>
                        <td style={{padding: '5px'}}>
                          {log.modifiedBy ? log.modifiedBy.name : '알 수 없음'}
                        </td>
                        <td style={{textAlign: 'right', padding: '5px'}}>
                          {log.oldValue}
                        </td>
                        <td style={{textAlign: 'right', padding: '5px'}}>
                          {log.newValue}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!showOriginalDiff &&
            (modifiedRows.size > 0 || deletedRows.size > 0) &&
            renderOriginalChangesSummary()}

          <div
            style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <button onClick={copySelectedCells}>Copy</button>
              <button onClick={cutSelectedCells} style={{marginLeft: '10px'}}>
                Cut
              </button>
              <button onClick={pasteClipboardContent} style={{marginLeft: '10px'}}>
                Paste
              </button>
              <button onClick={handleUndo} style={{marginLeft: '10px'}}>
                Undo
              </button>
              <button onClick={handleRedo} style={{marginLeft: '10px'}}>
                Redo
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmitChanges}
                disabled={isSaving || (modifiedRows.size === 0 && deletedRows.size === 0)}
                style={{
                  backgroundColor:
                    modifiedRows.size > 0 || deletedRows.size > 0 ? '#4CAF50' : '#e0e0e0',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px'
                }}>
                {isSaving
                  ? 'Saving...'
                  : `Submit Changes${
                      modifiedRows.size > 0 || deletedRows.size > 0
                        ? ` (${modifiedRows.size + deletedRows.size})`
                        : ''
                    }`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Spreadsheet
