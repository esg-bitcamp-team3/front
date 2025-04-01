'use client'

import {
  getEmissionDataFromStationaryCombustion,
  getChangeLogsOfEmissionDataFromElectricity,
  getEmissionDataFromElectricity
} from '@/lib/api/get'
import {ActivityDataForMobileCombustion} from '@/lib/api/interfaces/enumTypes'
import {
  IEmissionInfo,
  IChangeLogInfo,
  IFuelInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {IEmissionForm} from '@/lib/api/interfaces/updateForm'
import {updateEmissionDataFromElectricity} from '@/lib/api/put'
import {
  ActionBar,
  Badge,
  Box,
  Button,
  Checkbox,
  Circle,
  createListCollection,
  Float,
  For,
  Input,
  ListCollection,
  NativeSelect,
  Popover,
  Portal,
  Select,
  Switch,
  Table,
  Text
} from '@chakra-ui/react'
import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  MouseEvent,
  JSX,
  useMemo,
  memo,
  useCallback
} from 'react'
import ChangeLogs from './ChangeLogs'
import {PaginatedResponse} from '@/lib/api/type'
import {toaster} from '../ui/toaster'
import {set} from 'react-hook-form'

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

// Add this hook at the top of your file, after your imports

/**
 * Custom hook to manage cell selection logic
 */
const useCellSelected = (selection: SelectionRange) => {
  const allColumnOrder = [
    'facilityName',
    'emissionActivity',
    ...columnNames,
    'total',
    'uncertainty'
  ]

  const selectionBitmapRef = useRef<Set<string>>(new Set())

  // Update bitmap whenever selection changes
  useEffect(() => {
    const newBitmap = new Set<string>()

    if (selection.start && selection.end) {
      const startRow = Math.min(selection.start.row, selection.end.row)
      const endRow = Math.max(selection.start.row, selection.end.row)

      const startColIndex = allColumnOrder.indexOf(selection.start.col)
      const endColIndex = allColumnOrder.indexOf(selection.end.col)
      const minColIndex = Math.min(startColIndex, endColIndex)
      const maxColIndex = Math.max(startColIndex, endColIndex)

      // Precompute all selected cells and add to bitmap
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
          newBitmap.add(`${rowIndex}:${allColumnOrder[colIndex]}`)
        }
      }
    }

    selectionBitmapRef.current = newBitmap
  }, [selection, allColumnOrder])

  // Ultra-fast O(1) lookup using the bitmap
  const isCellSelected = useCallback((rowIndex: number, colKey: string): boolean => {
    return selectionBitmapRef.current.has(`${rowIndex}:${colKey}`)
  }, [])

  // Check if cell is the primary cell (where selection started)
  const isPrimaryCell = (rowIndex: number, colKey: string): boolean => {
    return selection?.start?.row === rowIndex && selection?.start?.col === colKey
  }

  // Get neighbor selection status
  const getNeighborSelectionStatus = (rowIndex: number, colKey: string) => {
    const topSelected = isCellSelected(rowIndex - 1, colKey)
    const bottomSelected = isCellSelected(rowIndex + 1, colKey)

    const currentColIndex = allColumnOrder.indexOf(colKey)
    const leftCol = currentColIndex > 0 ? allColumnOrder[currentColIndex - 1] : null
    const rightCol =
      currentColIndex < allColumnOrder.length - 1
        ? allColumnOrder[currentColIndex + 1]
        : null

    const leftSelected = leftCol ? isCellSelected(rowIndex, leftCol) : false
    const rightSelected = rightCol ? isCellSelected(rowIndex, rightCol) : false

    return {topSelected, bottomSelected, leftSelected, rightSelected}
  }

  // Get border styling based on selection
  const getBorderStyle = (
    rowIndex: number,
    colKey: string,
    isSelected: boolean,
    hasChangeLogs: boolean = false
  ): React.CSSProperties => {
    if (!isSelected) {
      return hasChangeLogs ? {border: '1px dashed orange.500'} : {}
    }

    const {topSelected, bottomSelected, leftSelected, rightSelected} =
      getNeighborSelectionStatus(rowIndex, colKey)
    const isPrimary = isPrimaryCell(rowIndex, colKey)

    return {
      borderTop: !topSelected
        ? '2px solid var(--chakra-colors-blue-500)'
        : '1px solid var(--chakra-colors-blue-200)',
      borderBottom: !bottomSelected
        ? '2px solid var(--chakra-colors-blue-500)'
        : '1px solid var(--chakra-colors-blue-200)',
      borderLeft: !leftSelected
        ? '2px solid var(--chakra-colors-blue-500)'
        : '1px solid var(--chakra-colors-blue-200)',
      borderRight: !rightSelected
        ? '2px solid var(--chakra-colors-blue-500)'
        : '1px solid var(--chakra-colors-blue-200)',
      position: 'relative' as React.CSSProperties['position'],
      zIndex: isPrimary ? 2 : 1
    }
  }

  return {
    isCellSelected,
    isPrimaryCell,
    getNeighborSelectionStatus,
    getBorderStyle
  }
}

// Add this component before your Spreadsheet component
const SelectionOverlay = ({
  selection,
  containerRef
}: {
  selection: SelectionRange
  containerRef: React.RefObject<HTMLDivElement> | null
}) => {
  const [position, setPosition] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const positionRef = useRef<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const updatePosition = useCallback(() => {
    if (!selection.start || !selection.end || !containerRef?.current) return

    const startRect = getCellRect(selection.start.row, selection.start.col)
    const endRect = getCellRect(selection.end.row, selection.end.col)

    if (!startRect || !endRect) return

    const containerRect = containerRef.current.getBoundingClientRect()

    const newPosition = {
      top: Math.min(startRect.top, endRect.top) - containerRect.top,
      left: Math.min(startRect.left, endRect.left) - containerRect.left,
      width:
        Math.max(startRect.right, endRect.right) - Math.min(startRect.left, endRect.left),
      height:
        Math.max(startRect.bottom, endRect.bottom) - Math.min(startRect.top, endRect.top)
    }

    // Only update state if the position has changed significantly
    if (
      !positionRef.current ||
      Math.abs(positionRef.current.top - newPosition.top) > 1 ||
      Math.abs(positionRef.current.left - newPosition.left) > 1 ||
      Math.abs(positionRef.current.width - newPosition.width) > 1 ||
      Math.abs(positionRef.current.height - newPosition.height) > 1
    ) {
      positionRef.current = newPosition
      setPosition(newPosition)
    }
  }, [selection, containerRef])

  useEffect(() => {
    updatePosition()
  }, [updatePosition])

  if (!position) return null

  return (
    <Box
      position="absolute"
      style={{
        transform: `translate(${position.left}px, ${position.top}px)`,
        width: `${position.width}px`,
        height: `${position.height}px`
      }}
      border="2px solid"
      borderColor="blue.500"
      pointerEvents="none"
      zIndex={1}
      boxShadow="0 0 0 1px rgba(66, 153, 225, 0.4)"
      background="rgba(66, 153, 225, 0.08)"
    />
  )
}

// Near the top of your file, add:
const cellPositionCache = new Map<string, DOMRect>()

const getCellRect = (rowIndex: number, colKey: string): DOMRect | null => {
  const cacheKey = `${rowIndex}-${colKey}`

  // Check if we have this cell position cached
  if (cellPositionCache.has(cacheKey)) {
    return cellPositionCache.get(cacheKey) || null
  }

  // If not in cache, query the DOM
  const cell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colKey}"]`)
  if (!cell) return null

  const rect = cell.getBoundingClientRect()

  // Cache the result
  cellPositionCache.set(cacheKey, rect)
  return rect
}

// Add a function to clear the cache when the grid changes
const clearCellPositionCache = () => {
  cellPositionCache.clear()
}

type CellPosition = {
  row: number
  col: string
}

type SelectionRange = {
  start: CellPosition | null
  end: CellPosition | null
}

// Update the RowData type to include _id for tracking
type RowData = IEmissionForm & {_id: string}

interface EditableCellProps {
  value: number
  onChange: (value: number) => void
  isSelected: boolean
  onMouseDown: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseOver: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseUp: (e: MouseEvent) => void
  rowIndex: number
  colKey: string
  onKeyDown: (e: KeyboardEvent, rowIndex: number, colKey: string) => void
  _id: string
  showDifference?: boolean
  getCellDifference: (
    rowId: string,
    colKey: string
  ) => {
    changed: boolean
    originalValue: number | string | null // Update type to allow string
    currentValue: number | string | null // Update type to allow string
    difference: number | null
  }
  getCellChangeLogs: (rowId: string, colKey: string) => IChangeLogInfo[]
  getColumnDisplayName: (colKey: string) => string // Add this missing prop
}

interface EditableStringCellProps {
  value: string
  onChange: (value: string) => void
  isSelected: boolean
  onMouseDown: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseOver: (e: MouseEvent, rowIndex: number, colKey: string) => void
  onMouseUp: (e: MouseEvent) => void
  rowIndex: number
  colKey: string
  onKeyDown: (e: KeyboardEvent, rowIndex: number, colKey: string) => void
  _id: string
  showDifference?: boolean
  getCellDifference: (
    rowId: string,
    colKey: string
  ) => {
    changed: boolean
    originalValue: number | string | null // Update type to allow string
    currentValue: number | string | null // Update type to allow string
    difference: number | null
  }
  getCellChangeLogs: (rowId: string, colKey: string) => IChangeLogInfo[]
  getColumnDisplayName: (colKey: string) => string // Add this missing prop
}
const ReadOnlyNumberCell = memo(
  ({
    value,
    rowIndex,
    colKey,
    _id,
    showDifference = true,
    getCellDifference,
    getCellChangeLogs,
    getColumnDisplayName
  }: Omit<
    EditableCellProps,
    'onChange' | 'isSelected' | 'onMouseDown' | 'onMouseOver' | 'onMouseUp' | 'onKeyDown'
  >) => {
    // Get difference data
    const difference = _id && getCellDifference ? getCellDifference(_id, colKey) : null
    const hasChanged = difference && difference.changed

    // Get change logs for this cell
    const cellChangeLogs = _id && getCellChangeLogs ? getCellChangeLogs(_id, colKey) : []
    const hasChangeLogs = cellChangeLogs.length > 0

    return (
      <Box position="relative" width="100%" data-row={rowIndex} data-col={colKey}>
        <Input
          value={String(value)}
          readOnly={true}
          size="sm"
          height="32px"
          px={2}
          py={1}
          fontWeight="bold"
          borderRadius="0"
          border="none"
          bg="gray.50"
          title="자동 계산된 합계 (수정 불가)"
          _hover={{
            cursor: 'not-allowed',
            bg: 'gray.100'
          }}
        />

        {hasChangeLogs && showDifference && (
          <ChangeLogs
            _id={_id}
            colKey={colKey}
            getCellChangeLogs={getCellChangeLogs}
            getColumnDisplayName={getColumnDisplayName}
          />
        )}
      </Box>
    )
  }
)

const ReadOnlyStringCell = memo(
  ({
    value,
    rowIndex,
    colKey,
    _id,
    showDifference = true,
    getCellDifference,
    getCellChangeLogs,
    getColumnDisplayName
  }: Omit<
    EditableStringCellProps,
    'onChange' | 'isSelected' | 'onMouseDown' | 'onMouseOver' | 'onMouseUp' | 'onKeyDown'
  >) => {
    // Get difference data
    const difference = _id && getCellDifference ? getCellDifference(_id, colKey) : null
    const hasChanged = difference && difference.changed

    // Get change logs for this cell
    const cellChangeLogs = _id && getCellChangeLogs ? getCellChangeLogs(_id, colKey) : []
    const hasChangeLogs = cellChangeLogs.length > 0

    return (
      <Box
        position="relative"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        data-row={rowIndex}
        data-col={colKey}
        px={2}>
        <Text
          textStyle="xs"
          height="32px"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          title={value} // Add tooltip to show full text on hover
          textAlign="center"
          padding={2}
          width="100%"
          color="gray.500" // Set text color to gray
          bg="gray.50" // Set background color to gray
        >
          {value}
        </Text>

        {hasChangeLogs && showDifference && (
          <ChangeLogs
            _id={_id}
            colKey={colKey}
            getCellChangeLogs={getCellChangeLogs}
            getColumnDisplayName={getColumnDisplayName}
          />
        )}
      </Box>
    )
  }
)

// 2. Then add this function to calculate row totals
const calculateRowTotal = (row: RowData): number => {
  let total = 0
  for (let i = 1; i <= 12; i++) {
    const key = `data${i}` as keyof RowData
    const value = row[key]
    total += typeof value === 'number' ? value : 0
  }
  return total
}
const NumberEditableCell = memo(
  ({
    value,
    onChange,
    isSelected,
    onMouseDown,
    onMouseOver,
    onMouseUp,
    rowIndex,
    colKey,
    onKeyDown,
    _id,
    showDifference = true,
    getCellDifference,
    getCellChangeLogs,
    getColumnDisplayName
  }: EditableCellProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [showHistoryPopup, setShowHistoryPopup] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(String(value))

    // Get difference data
    const difference = _id && getCellDifference ? getCellDifference(_id, colKey) : null
    const hasChanged = difference && difference.changed

    // Get change logs for this cell
    const cellChangeLogs = _id && getCellChangeLogs ? getCellChangeLogs(_id, colKey) : []
    const hasChangeLogs = cellChangeLogs.length > 0

    // Format the display value to show differences inline
    const displayValue = (): string => {
      if (!showDifference || !hasChanged || !difference) return String(value)

      // For numeric cells, show the difference inline
      if (difference.difference !== null) {
        const sign = difference.difference > 0 ? '+' : ''
        return `${value} (${sign}${difference.difference})`
      }

      return String(value)
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

    // Determine color based on change direction
    const getChangeColor = () => {
      if (!hasChanged || !difference) return undefined
      return difference.difference !== null && difference.difference > 0
        ? 'green.500'
        : 'red.500'
    }

    // Update inputValue when value prop changes
    useEffect(() => {
      setInputValue(String(value))
    }, [value])

    // Focus and select text when cell is selected
    useEffect(() => {
      if (isSelected && inputRef.current) {
        inputRef.current.focus()

        // When cell gets focus and has a formatted display value,
        // select just the actual value part for easier editing
        if (hasChanged && inputRef.current.value.includes('(')) {
          // Select just the number part, before the parenthesis
          const endPos = inputRef.current.value.indexOf(' (')
          inputRef.current.setSelectionRange(
            0,
            endPos > 0 ? endPos : inputRef.current.value.length
          )
        } else {
          inputRef.current.select()
        }
      }
    }, [isSelected, hasChanged])

    // Handle focus to switch between display and edit modes
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (hasChanged && e.target.value.includes('(')) {
        // When focusing, show just the raw value
        e.target.value = String(value)
        e.target.select()
      } else {
        e.target.select()
      }
    }

    // Handle blur to restore the formatted display and commit the value
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      // If valid number, update with the numeric value
      if (!isNaN(newValue)) {
        onChange(newValue)
      } else {
        // If invalid, restore the original value
        setInputValue(String(value))
      }
    }

    // Handle input change - validate numeric input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputText = e.target.value

      // Allow empty string, numbers, decimal point, and minus sign
      if (inputText === '' || /^-?\d*\.?\d*$/.test(inputText)) {
        setInputValue(inputText)
      }
    }

    // Handle key press - commit on Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const newValue = parseFloat(inputValue)
        if (!isNaN(newValue)) {
          onChange(newValue)
        } else if (inputValue === '') {
          // Handle empty string as zero
          onChange(0)
        }
      }
    }

    return (
      <Box position="relative" width="100%" data-row={rowIndex} data-col={colKey}>
        <Input
          ref={inputRef}
          value={isSelected ? inputValue : displayValue()}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={e => onMouseDown(e, rowIndex, colKey)}
          onMouseOver={e => onMouseOver(e, rowIndex, colKey)}
          onMouseUp={onMouseUp}
          onKeyDown={e => onKeyDown(e, rowIndex, colKey)}
          onClick={() => hasChangeLogs && showDifference && setShowHistoryPopup(true)}
          title={getTooltip()}
          type="text"
          inputMode="decimal"
          size="sm"
          height="32px"
          px={2}
          py={1}
          color={showDifference && hasChanged ? getChangeColor() : undefined}
          fontWeight={showDifference && hasChanged ? 'bold' : 'normal'}
          borderRadius="0"
          border="none"
          _focus={{
            boxShadow: 'none',
            borderColor: 'transparent',
            outline: 'none'
          }}
          _hover={{
            bg: isSelected ? 'blue.100' : hasChangeLogs ? 'yellow.100' : 'gray.50'
          }}
        />

        {/* Enhanced change history indicator */}
        {hasChangeLogs && showDifference && (
          <ChangeLogs
            _id={_id}
            colKey={colKey}
            getCellChangeLogs={getCellChangeLogs}
            getColumnDisplayName={getColumnDisplayName}
          />
        )}
      </Box>
    )
  }
)

const StringEditableCell = memo(
  ({
    value,
    onChange,
    isSelected,
    onMouseDown,
    onMouseOver,
    onMouseUp,
    rowIndex,
    colKey,
    onKeyDown,
    _id,
    showDifference = true,
    getCellDifference,
    getCellChangeLogs,
    getColumnDisplayName
  }: EditableStringCellProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState<string>(value || '')

    // Get difference data
    const difference = _id && getCellDifference ? getCellDifference(_id, colKey) : null
    const hasChanged = difference && difference.changed

    // Get change logs for this cell
    const cellChangeLogs = _id && getCellChangeLogs ? getCellChangeLogs(_id, colKey) : []
    const hasChangeLogs = cellChangeLogs.length > 0

    // Format the display value - for strings, we don't need special formatting
    const displayValue = (): string => {
      return value || ''
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

    // Determine color based on change
    const getChangeColor = () => {
      if (!hasChanged || !difference) return undefined
      return 'blue.500' // Use blue for text changes
    }

    // Update inputValue when value prop changes
    useEffect(() => {
      setInputValue(value || '')
    }, [value])

    // Focus and select text when cell is selected
    useEffect(() => {
      if (isSelected && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isSelected])

    // Handle focus to select the text
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    }

    // Handle blur to commit the value
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    // Handle input change - no validation needed for string inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    // Handle key press - commit on Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onChange(inputValue)
      }
    }

    return (
      <Box position="relative" width="100%" data-row={rowIndex} data-col={colKey}>
        <Input
          ref={inputRef}
          value={isSelected ? inputValue : displayValue()}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={e => onMouseDown(e, rowIndex, colKey)}
          onMouseOver={e => onMouseOver(e, rowIndex, colKey)}
          onMouseUp={onMouseUp}
          onKeyDown={e => onKeyDown(e, rowIndex, colKey)}
          title={getTooltip()}
          type="text"
          size="sm"
          height="32px"
          px={2}
          py={1}
          color={showDifference && hasChanged ? getChangeColor() : undefined}
          fontWeight={showDifference && hasChanged ? 'bold' : 'normal'}
          borderRadius="0"
          border="none"
          _focus={{
            boxShadow: 'none',
            borderColor: 'transparent',
            outline: 'none'
          }}
          _hover={{
            bg: isSelected ? 'blue.100' : hasChangeLogs ? 'yellow.100' : 'gray.50'
          }}
        />

        {/* Enhanced change history indicator */}
        {hasChangeLogs && showDifference && (
          <ChangeLogs
            _id={_id}
            colKey={colKey}
            getCellChangeLogs={getCellChangeLogs}
            getColumnDisplayName={getColumnDisplayName}
          />
        )}
      </Box>
    )
  }
)
const SelectableCell = memo(
  ({
    value,
    onChange,
    isSelected,
    onMouseDown,
    onMouseOver,
    onMouseUp,
    rowIndex,
    colKey,
    onKeyDown,
    _id,
    showDifference = true,
    getCellDifference,
    getCellChangeLogs,
    getColumnDisplayName,
    collection
  }: EditableStringCellProps & {
    collection: ListCollection<{value: string; label: string}>
  }) => {
    // Get difference data
    const difference = _id && getCellDifference ? getCellDifference(_id, colKey) : null
    const hasChanged = difference && difference.changed

    // Get change logs for this cell
    const cellChangeLogs = _id && getCellChangeLogs ? getCellChangeLogs(_id, colKey) : []
    const hasChangeLogs = cellChangeLogs.length > 0

    // Determine color based on change direction
    const getChangeColor = () => {
      if (!hasChanged || !difference) return undefined
      return difference.difference !== null && difference.difference > 0
        ? 'green.500'
        : 'red.500'
    }

    return (
      <Box position="relative">
        <Select.Root
          mx={2}
          defaultValue={[value]}
          value={[value]}
          onValueChange={e => onChange(e.value[0])}
          collection={collection}
          size="md"
          width="150px">
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText
                placeholder="Select option"
                color={showDifference && hasChanged ? getChangeColor() : undefined}
                fontWeight={showDifference && hasChanged ? 'bold' : 'normal'}
              />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map(item => (
                <Select.Item padding={2} item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>

        {/* Enhanced change history indicator with count */}
        {hasChangeLogs && showDifference && (
          <ChangeLogs
            _id={_id}
            colKey={colKey}
            getCellChangeLogs={getCellChangeLogs}
            getColumnDisplayName={getColumnDisplayName}
          />
        )}
      </Box>
    )
  }
)

export interface SpreadsheetProps {
  activityData: IFuelInfo[]
  emissionActivity: string[]
  emissionData: IEmissionInfo[]
  onDelete: (id: string) => void
}
const Spreadsheet = ({
  activityData,
  emissionActivity,
  emissionData,
  onDelete
}: SpreadsheetProps) => {
  // Add state to store all emission IDs
  const [emissionDataIds, setEmissionDataIds] = useState<string[]>([])

  const [data, setData] = useState<RowData[]>([])

  // Add history state for undo functionality
  const [history, setHistory] = useState<RowData[][]>([])
  const [redoHistory, setRedoHistory] = useState<RowData[][]>([])
  const [clipboard, setClipboard] = useState<string[][]>([])

  // Add inside Spreadsheet component, after other state declarations
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // Update the type of originalData
  const [originalData, setOriginalData] = useState<Record<string, IEmissionInfo>>({})

  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set())
  const [isModified, setIsModified] = useState<boolean>(false)

  // Add function to submit changes to server
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Add this new state to track whether we're showing original differences
  const [showOriginalDiff, setShowOriginalDiff] = useState<boolean>(false)

  // Add state for change logs
  const [changeLogs, setChangeLogs] = useState<IChangeLogInfo[]>([])
  const [isLoadingChangeLogs, setIsLoadingChangeLogs] = useState<boolean>(false)

  const emissionActivityCollection = useMemo(() => {
    return createListCollection({
      items: (emissionActivity || []).map(activity => ({
        value: activity,
        label: activity
      })),
      itemToString: (item: {value: string; label: string}) => item.label,
      itemToValue: (item: {value: string; label: string}) => item.value
    })
  }, [emissionActivity])

  const activityDataCollection = useMemo(() => {
    return createListCollection({
      items: (activityData || []).map(activity => ({
        value: activity.fuel._id,
        label: activity.fuel.name
      })),
      itemToString: (item: {value: string; label: string}) => item.label,
      itemToValue: (item: {value: string; label: string}) => item.value
    })
  }, [activityData])

  const [selection, setSelection] = useState<SelectionRange>({
    start: null,
    end: null
  })

  // Use our custom hook
  const {isCellSelected} = useCellSelected(selection)

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const hasSelection = selectedRows.length > 0
  const indeterminate = hasSelection && selectedRows.length < data.length

  // Update handleSubmitChanges to use the new schema format
  const handleSubmitChanges = async (): Promise<void> => {
    try {
      setIsSaving(true)
      // Prepare modified rows data for PUT requests
      if (modifiedRows.size > 0) {
        const modifiedDataPromises = Array.from(modifiedRows).map(async _id => {
          // Find the row data
          const rowData = data.find(row => row._id === _id)

          if (!rowData) return null

          // Prepare the data in the format expected by the API
          const updateData: Partial<IEmissionForm> = rowData

          console.log(rowData)

          return updateEmissionDataFromElectricity({
            id: _id,
            data: updateData
          })
        })

        // Wait for all requests to complete
        const results = await Promise.all(modifiedDataPromises)
        console.log('Update results:', results)
      }

      // Clear tracking after successful save
      setModifiedRows(new Set())
      setIsModified(false)
      toaster.success({
        title: '변경 사항이 저장되었습니다.'
      })

      await fetchData()
    } catch (error) {
      toaster.error({
        title: '변경 사항 저장 중 오류가 발생했습니다.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Extract and save all emission data IDs
      const allIds = emissionData
        .map((item: IEmissionInfo) => item._id)
        .filter((id): id is string => !!id)
      setEmissionDataIds(allIds)

      // Store original data for comparison
      const originalServerData: Record<string, IEmissionInfo> = {}
      emissionData.forEach((item: IEmissionInfo) => {
        if (item._id) {
          originalServerData[item._id] = item
        }
      })
      setOriginalData(originalServerData)

      // Transform data into spreadsheet format
      const transformedData = emissionData.map((item: IEmissionInfo, index: number) => {
        const rowData: RowData = {
          ...item,
          activityData: item.activityData?._id
        }

        return rowData
      })

      setData(transformedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the data fetching and transformation
  useEffect(() => {
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
      toaster.info({
        title: '변경 사항이 취소되었습니다.'
      })
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
      toaster.info({
        title: '변경 사항이 복원되었습니다.'
      })
    }
  }
  // Update handleCellChange to track modified rows
  const handleCellChange = (
    rowIndex: number,
    columnKey: string,
    newValue: number | string
  ): void => {
    saveToHistory()
    const updatedData = [...data]
    const row = updatedData[rowIndex]
    const _id = row._id

    // Store previous value before updating
    const previousValue = row[columnKey as keyof RowData]

    // Update the cell value
    updatedData[rowIndex] = {...row, [columnKey]: newValue}

    // Recalculate total if needed
    if (columnKey.startsWith('data')) {
      const newTotal = calculateRowTotal(updatedData[rowIndex])
      updatedData[rowIndex].total = newTotal
    }

    // Only check for modifications if we have an ID to track
    if (_id) {
      const originalRow = originalData[_id]
      if (!originalRow) {
        // New row, always mark as modified
        setModifiedRows(prev => new Set(prev).add(_id))
      } else {
        // Fast path: First check only the changed field
        let isModified = false

        // Special handling for activityData
        if (columnKey === 'activityData') {
          const originalActivityId = originalRow.activityData?._id || ''
          isModified = newValue !== originalActivityId
        } else {
          // Direct comparison with original value
          const originalValue = originalRow[columnKey as keyof IEmissionInfo]
          isModified = newValue !== originalValue
        }

        // If the changed field is different, mark as modified
        if (isModified) {
          setModifiedRows(prev => new Set(prev).add(_id))
        }
        // If the changed field is now the same as original, we need to check if any other field is still different
        else if (previousValue !== newValue) {
          // Do a full comparison of all fields to see if the row is still modified
          isModified = checkRowIsModified(updatedData[rowIndex], originalRow)

          if (isModified) {
            setModifiedRows(prev => new Set(prev).add(_id))
          } else {
            setModifiedRows(prev => {
              const newSet = new Set(prev)
              newSet.delete(_id)
              return newSet
            })
          }
        }
      }
    }

    setData(updatedData)
    setIsModified(prev => modifiedRows.size > 0)
  }

  const checkRowIsModified = (
    currentRow: RowData,
    originalRow: IEmissionInfo
  ): boolean => {
    // Check each field for differences
    for (const key of Object.keys(currentRow)) {
      // Skip ID
      if (key === '_id') continue

      const currentValue = currentRow[key as keyof RowData]

      // Special handling for activityData
      if (key === 'activityData') {
        const originalActivityId = originalRow?.activityData?._id || ''
        if (currentValue !== originalActivityId) return true
        continue
      }

      const originalValue = originalRow[key as keyof IEmissionInfo]

      // If any value is different, the row is modified
      if (currentValue !== originalValue) return true
    }

    // No differences found
    return false
  }
  // Add function to delete a row
  const handleDelete = async (rowIds: string[]): Promise<void> => {
    if (!rowIds.length) return

    try {
      // Send delete requests to the backend
      const deletePromises = rowIds.map(async id => {
        // Replace this with your actual delete API call
        await onDelete(id)
      })

      // Wait for all delete requests to complete
      await Promise.all(deletePromises)

      // Remove selected rows from modified if they were previously modified
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        rowIds.forEach(id => newSet.delete(id))
        return newSet
      })
      setIsModified(modifiedRows.size > 0)

      // Remove rows from data
      setData(prevData => prevData.filter(row => !rowIds.includes(row._id)))

      // Clear row selection after deletion
      setSelectedRows([])
    } catch (error) {
      console.error('Error deleting rows:', error)
      alert('Failed to delete rows. Please try again.')
    }
  }

  const handleCancelChanges = async (): Promise<void> => {
    // Save current state to history in case user wants to redo
    saveToHistory()

    // Create new data array by restoring original values for modified rows
    const restoredData = await Promise.all(
      data.map(async row => {
        // If this row was modified, restore it from originalData
        if (row._id && modifiedRows.has(row._id)) {
          const originalRow = originalData[row._id]
          if (originalRow) {
            // Create a new row with originalData values
            return {
              ...row,
              ...originalRow,
              activityData: originalRow.activityData?._id
            }
          }
        }
        // If not modified, keep as is
        return row
      })
    )

    // Update the data state
    setData(restoredData)

    // Clear the modified rows tracking
    setModifiedRows(new Set())
    setIsModified(false)

    toaster.info({
      title: '변경 사항이 취소되었습니다.'
    })
  }

  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  // In your component, create throttled handlers
  const throttledHandleMouseOver = useCallback(
    throttle((e: React.MouseEvent, rowIndex: number, colKey: string) => {
      if (isSelectingRef.current && selection.start) {
        // Avoid state updates if the selection hasn't changed
        if (selection.end?.row === rowIndex && selection.end?.col === colKey) return

        setSelection(prev => ({
          ...prev,
          end: {row: rowIndex, col: colKey}
        }))
      }
    }, 16), // Approximately 60 FPS
    [selection.start]
  )

  const isSelectingRef = useRef(false)

  const handleMouseDown = (
    e: React.MouseEvent,
    rowIndex: number,
    colKey: string
  ): void => {
    e.preventDefault()
    isSelectingRef.current = true

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
    if (isSelectingRef.current && selection.start) {
      setSelection({
        ...selection,
        end: {row: rowIndex, col: colKey}
      })
    }
  }

  const handleMouseUp = (e: React.MouseEvent): void => {
    isSelectingRef.current = false
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colKey: string
  ): void => {
    const allColumnOrder = [
      'facilityName',
      'emissionActivity',
      ...columnNames,
      'total',
      'uncertainty'
    ]

    const colIndex = allColumnOrder.indexOf(colKey)

    // Handle Shift key for range selection
    if (e.shiftKey) {
      // Start a selection if none exists
      if (!selection.start) {
        setSelection({
          start: {row: rowIndex, col: colKey},
          end: {row: rowIndex, col: colKey}
        })
        return
      }

      // Extend existing selection
      switch (e.key) {
        case 'ArrowRight':
          if (colIndex < allColumnOrder.length - 1) {
            setSelection({
              ...selection,
              end: {row: rowIndex, col: allColumnOrder[colIndex + 1]}
            })
          }
          e.preventDefault()
          break

        case 'ArrowLeft':
          if (colIndex > 0) {
            setSelection({
              ...selection,
              end: {row: rowIndex, col: allColumnOrder[colIndex - 1]}
            })
          }
          e.preventDefault()
          break

        case 'ArrowUp':
          if (rowIndex > 0) {
            setSelection({
              ...selection,
              end: {row: rowIndex - 1, col: colKey}
            })
          }
          e.preventDefault()
          break

        case 'ArrowDown':
          if (rowIndex < data.length - 1) {
            setSelection({
              ...selection,
              end: {row: rowIndex + 1, col: colKey}
            })
          }
          e.preventDefault()
          break
      }
    } else {
      // Original keyboard navigation for non-shift keys
      switch (e.key) {
        case 'ArrowRight':
          if (colIndex < allColumnOrder.length - 1) {
            // Move to the next column
            setSelection({
              start: {row: rowIndex, col: allColumnOrder[colIndex + 1]},
              end: {row: rowIndex, col: allColumnOrder[colIndex + 1]}
            })
          }
          break

        case 'ArrowLeft':
          if (colIndex > 0) {
            // Move to the previous column
            setSelection({
              start: {row: rowIndex, col: allColumnOrder[colIndex - 1]},
              end: {row: rowIndex, col: allColumnOrder[colIndex - 1]}
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
          if (!e.shiftKey && colIndex < allColumnOrder.length - 1) {
            // Tab: move right
            setSelection({
              start: {row: rowIndex, col: allColumnOrder[colIndex + 1]},
              end: {row: rowIndex, col: allColumnOrder[colIndex + 1]}
            })
          } else if (!e.shiftKey && rowIndex < data.length - 1) {
            // Tab at end of row: move to first column of next row
            setSelection({
              start: {row: rowIndex + 1, col: allColumnOrder[0]},
              end: {row: rowIndex + 1, col: allColumnOrder[0]}
            })
          } else if (e.shiftKey && colIndex > 0) {
            // Shift+Tab: move left
            setSelection({
              start: {row: rowIndex, col: allColumnOrder[colIndex - 1]},
              end: {row: rowIndex, col: allColumnOrder[colIndex - 1]}
            })
          } else if (e.shiftKey && rowIndex > 0) {
            // Shift+Tab at beginning of row: move to last column of previous row
            setSelection({
              start: {row: rowIndex - 1, col: allColumnOrder[allColumnOrder.length - 1]},
              end: {row: rowIndex - 1, col: allColumnOrder[allColumnOrder.length - 1]}
            })
          }
          break

        case 'Delete':
          handleDeleteSelectedCells()
          break
      }
    }
  }

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

    // Then use our delete function to clear them and track changes
    handleDeleteSelectedCells()
  }

  // Replace your existing pasteClipboardContent function with this improved version
  const pasteClipboardContent = (): void => {
    if (!selection.start || clipboard.length === 0) return

    // Save current state to history
    saveToHistory()

    const {row: startRow, col: startCol} = selection.start

    // Use all columns array for comprehensive selection
    const allColumnOrder = [
      'facilityName',
      'emissionActivity',
      ...columnNames,
      'total',
      'uncertainty'
    ]

    const startColIndex = allColumnOrder.indexOf(startCol)
    const updatedData = [...data]
    const modifiedRowIds = new Set<string>()

    // Paste the clipboard content
    clipboard.forEach((rowData, rowOffset) => {
      const targetRowIndex = startRow + rowOffset

      // Skip if we're past the end of the data
      if (targetRowIndex >= data.length) return

      rowData.forEach((cellValue, colOffset) => {
        const targetColIndex = startColIndex + colOffset

        // Skip if we're past the last column
        if (targetColIndex >= allColumnOrder.length) return

        const targetColKey = allColumnOrder[targetColIndex]

        // Skip certain columns if needed
        if (targetColKey === 'id' || targetColKey === '_id') return

        // Convert value to number for numeric columns
        let processedValue: string | number = cellValue
        if (
          targetColKey.startsWith('data') ||
          targetColKey === 'total' ||
          targetColKey === 'uncertainty'
        ) {
          const numValue = parseFloat(cellValue)
          processedValue = isNaN(numValue) ? 0 : numValue
        }

        // Update the cell
        updatedData[targetRowIndex] = {
          ...updatedData[targetRowIndex],
          [targetColKey]: processedValue
        }

        // Track the modified row
        const _id = updatedData[targetRowIndex]._id
        if (_id) {
          modifiedRowIds.add(_id)
        }
      })
    })

    // Update the data
    setData(updatedData)

    // Update modifiedRows state
    modifiedRowIds.forEach(id => {
      setModifiedRows(prev => new Set(prev).add(id))
    })
    setIsModified(true)
  }

  // Add this function to handle the Delete key
  const handleDeleteSelectedCells = (): void => {
    if (!selection.start || !selection.end) return

    // Save current state to history
    saveToHistory()

    const startRow = Math.min(selection.start.row, selection.end.row)
    const endRow = Math.max(selection.start.row, selection.end.row)

    // Get all columns in proper order for consistent selection
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

    const updatedData = [...data]
    const modifiedRowIds = new Set<string>()

    // Clear the selected cells
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const colKey = allColumnOrder[colIndex]

        // Skip certain columns if needed
        if (colKey === 'id' || colKey === '_id') continue

        // Determine the appropriate empty value based on column type
        let emptyValue: string | number = ''
        if (colKey.startsWith('data') || colKey === 'total' || colKey === 'uncertainty') {
          emptyValue = 0
        }

        // Update the cell
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          [colKey]: emptyValue
        }

        // Track the modified row
        const _id = updatedData[rowIndex]._id
        if (_id) {
          modifiedRowIds.add(_id)
        }
      }
    }

    // Update the data
    setData(updatedData)

    // Update modifiedRows state
    modifiedRowIds.forEach(id => {
      setModifiedRows(prev => new Set(prev).add(id))
    })
    setIsModified(modifiedRowIds.size > 0)
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

      // Handle Delete and Backspace keys
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't handle delete if we're in an input field
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return
        }
        handleDeleteSelectedCells()
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

    // Find the current row by _id
    const currentRow = data.find(row => row._id === rowId)
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
  const getCellChangeLogs = (rowId: string, colKey: string): IChangeLogInfo[] => {
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

  const tableContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>

  return (
    <div tabIndex={0}>
      {isLoading ? (
        <div style={{padding: '20px', textAlign: 'center'}}>Loading data...</div>
      ) : (
        <>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
            <div></div>
            <Switch.Root
              colorPalette="yellow"
              checked={showOriginalDiff}
              onCheckedChange={e => setShowOriginalDiff(e.checked)}
              onClick={toggleOriginalDiffView}
              disabled={isLoadingChangeLogs}>
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>변경 이력 보기</Switch.Label>
            </Switch.Root>
          </div>

          <div style={{overflowX: 'auto', position: 'relative'}} ref={tableContainerRef}>
            {selection.start && selection.end && (
              <SelectionOverlay selection={selection} containerRef={tableContainerRef} />
            )}
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    <Checkbox.Root
                      size="sm"
                      top="0.5"
                      aria-label="Select all rows"
                      checked={indeterminate ? 'indeterminate' : selectedRows.length > 0}
                      onCheckedChange={changes => {
                        setSelectedRows(changes.checked ? data.map(item => item._id) : [])
                      }}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    연도
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    번호
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    내부 시설명
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    배출활동
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    활동자료
                  </Table.ColumnHeader>

                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    단위
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    합계
                  </Table.ColumnHeader>
                  {/* Monthly columns */}
                  {columnNames.map(col => (
                    <Table.ColumnHeader
                      key={col}
                      p={2}
                      justifyContent="center"
                      textAlign="center">
                      {getColumnDisplayName(col)}
                    </Table.ColumnHeader>
                  ))}

                  <Table.ColumnHeader p={2} justifyContent="center" textAlign="center">
                    불확도
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((row, rowIndex) => (
                  <Table.Row
                    key={row._id}
                    style={{
                      backgroundColor:
                        row._id && modifiedRows.has(row._id) ? '#fff8e1' : 'white'
                    }}>
                    <Table.Cell>
                      <Checkbox.Root
                        padding={4}
                        size="sm"
                        top="0.5"
                        aria-label="Select row"
                        checked={selectedRows.includes(row._id)}
                        onCheckedChange={changes => {
                          setSelectedRows(prev =>
                            changes.checked
                              ? [...prev, row._id]
                              : selectedRows.filter(id => id !== row._id)
                          )
                        }}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                    {/* Year */}
                    <Table.Cell key={'year'}>
                      <NumberEditableCell
                        value={row.year || 0}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'year', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'year')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e => throttledHandleMouseOver(e, rowIndex, 'year')}
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey={'year'}
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>
                    {/* Serial number */}
                    <Table.Cell>
                      <StringEditableCell
                        value={String(row.facilityName || '')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'serialNumber', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'seerialNumber')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e =>
                          throttledHandleMouseOver(e, rowIndex, 'seerialNumber')
                        }
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="seerialNumber"
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>

                    {/* Facility name */}
                    <Table.Cell>
                      <StringEditableCell
                        value={String(row.facilityName || '')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'facilityName', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'facilityName')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e =>
                          throttledHandleMouseOver(e, rowIndex, 'facilityName')
                        }
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="facilityName"
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>

                    {/* Emission activity */}
                    <Table.Cell>
                      <SelectableCell
                        value={String(row.emissionActivity || '')}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'emissionActivity', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'emissionActivity')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e =>
                          throttledHandleMouseOver(e, rowIndex, 'emissionActivity')
                        }
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="emissionActivity"
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                        collection={emissionActivityCollection} // Convert ListCollection to array of label-value pairs
                      />
                    </Table.Cell>

                    {/* Activity data - use the activityData ID for the dropdown */}
                    <Table.Cell>
                      <SelectableCell
                        value={row.activityData || ''}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'activityData', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'activityData')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e =>
                          throttledHandleMouseOver(e, rowIndex, 'activityData')
                        }
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="activityData"
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                        collection={activityDataCollection} // Convert ListCollection to array of label-value pairs
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <ReadOnlyStringCell
                        value={
                          activityData.find(
                            activity => activity.fuel._id === row.activityData
                          )?.calorificValue?.gcbUnit || ''
                        } // Always use the calculated value
                        rowIndex={rowIndex}
                        colKey="unit"
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <ReadOnlyNumberCell
                        value={calculateRowTotal(row)} // Always use the calculated value
                        rowIndex={rowIndex}
                        colKey="total"
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>
                    {/* Monthly data cells - use the direct data property names */}
                    {columnNames.map(col => (
                      <Table.Cell key={`${row._id}-${col}`}>
                        <NumberEditableCell
                          value={
                            typeof row[col as keyof RowData] === 'number'
                              ? (row[col as keyof RowData] as number)
                              : 0
                          }
                          onChange={newValue => handleCellChange(rowIndex, col, newValue)}
                          isSelected={isCellSelected(rowIndex, col)}
                          onMouseDown={handleMouseDown}
                          onMouseOver={e => throttledHandleMouseOver(e, rowIndex, col)}
                          onMouseUp={handleMouseUp}
                          rowIndex={rowIndex}
                          colKey={col}
                          onKeyDown={handleKeyDown}
                          _id={row._id}
                          showDifference={showOriginalDiff}
                          getCellDifference={getCellDifference}
                          getCellChangeLogs={getCellChangeLogs}
                          getColumnDisplayName={getColumnDisplayName}
                        />
                      </Table.Cell>
                    ))}

                    {/* Total and uncertainty */}

                    <Table.Cell>
                      <NumberEditableCell
                        value={row.uncertainty || 0}
                        onChange={newValue =>
                          handleCellChange(rowIndex, 'uncertainty', newValue)
                        }
                        isSelected={isCellSelected(rowIndex, 'uncertainty')}
                        onMouseDown={handleMouseDown}
                        onMouseOver={e =>
                          throttledHandleMouseOver(e, rowIndex, 'uncertainty')
                        }
                        onMouseUp={handleMouseUp}
                        rowIndex={rowIndex}
                        colKey="uncertainty"
                        onKeyDown={handleKeyDown}
                        _id={row._id}
                        showDifference={showOriginalDiff}
                        getCellDifference={getCellDifference}
                        getCellChangeLogs={getCellChangeLogs}
                        getColumnDisplayName={getColumnDisplayName}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          <div
            style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <div>
              {/* <Button
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
              </Button> */}

              <ActionBar.Root open={hasSelection}>
                <ActionBar.Positioner>
                  <ActionBar.Content padding={4}>
                    <ActionBar.SelectionTrigger padding={2}>
                      {selectedRows.length} 선택됨
                    </ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                      onClick={() => handleDelete(selectedRows)}
                      variant="outline"
                      size="sm"
                      colorPalette="red"
                      padding={2}>
                      삭제하기
                    </Button>
                  </ActionBar.Content>
                </ActionBar.Positioner>
              </ActionBar.Root>
              <ActionBar.Root open={isModified}>
                <ActionBar.Positioner>
                  <ActionBar.Content padding={4}>
                    <ActionBar.SelectionTrigger padding={2}>
                      {modifiedRows.size} 수정됨
                    </ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                      onClick={handleSubmitChanges}
                      variant="outline"
                      size="sm"
                      colorPalette="blue"
                      padding={2}>
                      수정하기
                    </Button>
                    <Button
                      onClick={handleCancelChanges}
                      variant="outline"
                      size="sm"
                      colorPalette="red"
                      padding={2}>
                      취소하기
                    </Button>
                  </ActionBar.Content>
                </ActionBar.Positioner>
              </ActionBar.Root>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Spreadsheet
