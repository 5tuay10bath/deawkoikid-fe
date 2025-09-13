type Accessor<T> = keyof T | ((row: T) => React.ReactNode | string | number | boolean | null | undefined)

export type Column<T> = {
  header: string
  accessor: Accessor<T>
}

type TableProps<T> = {
  title: string
  columns: Column<T>[]
  data: T[]
}

function Table<T>({ title, columns, data }: TableProps<T>) {
  return (
    <>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {/* Check if accessor is a function or a key */}
                  {typeof column.accessor === "function"
                    ? // If accessor is a function, invoke it and ensure it returns a valid ReactNode
                      (column.accessor as (row: T) => React.ReactNode)(row)
                    : // If accessor is a key, access the value and ensure it is a valid ReactNode
                      (row[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Table
