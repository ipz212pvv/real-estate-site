import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Card, Pagination, Select } from "antd";

import { DebouncedInput } from "@/components/common/DebouncedInput.jsx";

import styles from "./DataTable.module.css";

export function DataTable({ data, columns }) {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    sortingFns: {
      alphabetic: (rowA, rowB, columnId) => {
        return rowA.original[columnId].localeCompare(rowB.original[columnId], "uk-UA");
      },
    },
  })

  const rowCount = useMemo(() => table.getRowCount(), [table.getRowCount()]);

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ minWidth: 150 }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <Filter column={header.column} />
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={100}>Нічого не знайдено</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: 16, textAlign: 'right' }}>
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            total={rowCount}
            onShowSizeChange={(_, size) => table.setPageSize(size)}
            onChange={(page) => table.setPageIndex(page - 1)}
            showSizeChanger
            showTotal={(total) => `Всього: ${total}`}
          />
        </div>
      </div>
    </Card>
  )
}

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant, filterSelectData = [] } = column.columnDef.meta ?? {}

  if (filterVariant === 'select') {
    const items = filterSelectData.map(item => ({ label: item, value: item }));

    return (
      <Select
        style={{ height: 26, width: "100%" }}
        allowClear
        onChange={(value) => column.setFilterValue(value)}
        options={items}
        showSearch
        size="xs"
      />
    )
  }

  return (
    <DebouncedInput
      value={columnFilterValue ?? ''}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Пошук...`}
      size="small"
      type="text"
      allowClear
    />
  )
}