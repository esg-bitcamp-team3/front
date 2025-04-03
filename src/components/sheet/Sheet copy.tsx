'use client'

import {useState, useRef, useEffect, KeyboardEvent, MouseEvent} from 'react'

type CellPosition = {
  row: number
  col: string
}

type SelectionRange = {
  start: CellPosition | null
  end: CellPosition | null
}

type RowData = {
  id: number
  [key: string]: string | number // Allow any string keys with string or number values
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
  onKeyDown
}: EditableCellProps) => {
  const cellRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSelected && cellRef.current) {
      cellRef.current.focus()
    }
  }, [isSelected])

  return (
    <input
      ref={cellRef}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onMouseDown={e => onMouseDown(e, rowIndex, colKey)}
      onMouseOver={e => onMouseOver(e, rowIndex, colKey)}
      onMouseUp={e => onMouseUp(e)}
      onKeyDown={e => onKeyDown(e, rowIndex, colKey)}
      style={{
        width: '100%',
        padding: '5px',
        backgroundColor: isSelected ? '#e0e0ff' : 'white',
        outline: isSelected ? '2px solid blue' : 'none'
      }}
    />
  )
}

const Spreadsheet = () => {
  const [data, setData] = useState<RowData[]>([
    {id: 0, col1: 'Hello', col2: 'World'},
    {id: 1, col1: 'React', col2: 'Grid'}
  ])

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

  const handleCellChange = (
    rowIndex: number,
    columnKey: string,
    newValue: string
  ): void => {
    saveToHistory()
    const updatedData = [...data]
    updatedData[rowIndex] = {...updatedData[rowIndex], [columnKey]: newValue}
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
    const columns: string[] = ['col1', 'col2']
    const colIndex = columns.indexOf(colKey)

    switch (e.key) {
      case 'ArrowRight':
        if (colIndex < columns.length - 1) {
          // Move to the next column
          setSelection({
            start: {row: rowIndex, col: columns[colIndex + 1]},
            end: {row: rowIndex, col: columns[colIndex + 1]}
          })
        }
        break

      case 'ArrowLeft':
        if (colIndex > 0) {
          // Move to the previous column
          setSelection({
            start: {row: rowIndex, col: columns[colIndex - 1]},
            end: {row: rowIndex, col: columns[colIndex - 1]}
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
        if (!e.shiftKey && colIndex < columns.length - 1) {
          // Tab: move right
          setSelection({
            start: {row: rowIndex, col: columns[colIndex + 1]},
            end: {row: rowIndex, col: columns[colIndex + 1]}
          })
        } else if (!e.shiftKey && rowIndex < data.length - 1) {
          // Tab at end of row: move to first column of next row
          setSelection({
            start: {row: rowIndex + 1, col: columns[0]},
            end: {row: rowIndex + 1, col: columns[0]}
          })
        } else if (e.shiftKey && colIndex > 0) {
          // Shift+Tab: move left
          setSelection({
            start: {row: rowIndex, col: columns[colIndex - 1]},
            end: {row: rowIndex, col: columns[colIndex - 1]}
          })
        } else if (e.shiftKey && rowIndex > 0) {
          // Shift+Tab at beginning of row: move to last column of previous row
          setSelection({
            start: {row: rowIndex - 1, col: columns[columns.length - 1]},
            end: {row: rowIndex - 1, col: columns[columns.length - 1]}
          })
        }
        break
    }
  }

  // Check if a cell is within the current selection
  const isCellSelected = (rowIndex: number, colKey: string): boolean => {
    if (!selection.start || !selection.end) return false

    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    const columns: string[] = ['col1', 'col2']
    const startColIndex = columns.indexOf(selection.start.col)
    const endColIndex = columns.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const currentColIndex = columns.indexOf(colKey)

    return (
      rowIndex >= startRow &&
      rowIndex <= endRow &&
      currentColIndex >= minColIndex &&
      currentColIndex <= maxColIndex
    )
  }

  // Copy selected cells to clipboard
  const copySelectedCells = (): void => {
    if (!selection.start || !selection.end) return

    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    const columns: string[] = ['col1', 'col2']
    const startColIndex = columns.indexOf(selection.start.col)
    const endColIndex = columns.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const copiedData: string[][] = []

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      const rowData: string[] = []
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const colKey = columns[colIndex]
        rowData.push(String(data[rowIndex][colKey] || ''))
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

    const columns: string[] = ['col1', 'col2']
    const startColIndex = columns.indexOf(selection.start.col)
    const endColIndex = columns.indexOf(selection.end.col)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    const updatedData = [...data]

    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const colKey = columns[colIndex]
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
    const columns: string[] = ['col1', 'col2']
    const startColIndex = columns.indexOf(startCol)

    const updatedData = [...data]

    clipboard.forEach((rowData, rowOffset) => {
      const targetRowIndex = startRow + rowOffset

      // Skip if we're past the end of the data
      if (targetRowIndex >= data.length) return

      rowData.forEach((cellValue, colOffset) => {
        const targetColIndex = startColIndex + colOffset

        // Skip if we're past the last column
        if (targetColIndex >= columns.length) return

        const targetColKey = columns[targetColIndex]
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

  return (
    <div tabIndex={0}>
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
      <table style={{borderCollapse: 'collapse', width: '100%'}}>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id}>
              <td>
                <EditableCell
                  value={String(row.col1)}
                  onChange={newValue => handleCellChange(rowIndex, 'col1', newValue)}
                  isSelected={isCellSelected(rowIndex, 'col1')}
                  onMouseDown={handleMouseDown}
                  onMouseOver={handleMouseOver}
                  onMouseUp={handleMouseUp}
                  rowIndex={rowIndex}
                  colKey="col1"
                  onKeyDown={handleKeyDown}
                />
              </td>
              <td>
                <EditableCell
                  value={String(row.col2)}
                  onChange={newValue => handleCellChange(rowIndex, 'col2', newValue)}
                  isSelected={isCellSelected(rowIndex, 'col2')}
                  onMouseDown={handleMouseDown}
                  onMouseOver={handleMouseOver}
                  onMouseUp={handleMouseUp}
                  rowIndex={rowIndex}
                  colKey="col2"
                  onKeyDown={handleKeyDown}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: '10px'}}>
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
    </div>
  )
}

export default Spreadsheet
