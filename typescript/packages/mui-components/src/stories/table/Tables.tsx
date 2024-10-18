import {
  Table as MUITable,
  TableContainer as MUITableContainer,
  TableHead as MUITableHead,
  TableRow as MUITableRow,
  TableCell as MUITableCell,
  TableBody as MUITableBody,
  TableProps,
  TableContainerProps,
  TableHeadProps,
  TableRowProps,
  TableCellProps,
  TableBodyProps
} from '../..'

const Table = (props: TableProps) => <MUITable {...props} />

const TableContainer = (props: TableContainerProps) => <MUITableContainer {...props} />

const TableHead = (props: TableHeadProps) => <MUITableHead {...props} />

const TableRow = (props: TableRowProps) => <MUITableRow {...props} />

const TableCell = (props: TableCellProps) => <MUITableCell {...props} />

const TableBody = (props: TableBodyProps) => <MUITableBody {...props} />

export { Table, TableContainer, TableHead, TableRow, TableCell, TableBody }
