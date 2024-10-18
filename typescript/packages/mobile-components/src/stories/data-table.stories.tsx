import React, { FC, useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable, Provider, Text } from 'react-native-paper'

interface TableExampleInterface {
  items: {
    key: number
    name: string
    calories: number
    fat: number
  }[]
  page: number
  setPage: (page: number) => void
  from: number
  to: number
  numberOfItemsPerPageList: number[]
  itemsPerPage: number
  onItemsPerPageChange: (item: number) => void
}

const TableExample: FC<TableExampleInterface> = ({
  items,
  page,
  from,
  to,
  numberOfItemsPerPageList,
  itemsPerPage,
  onItemsPerPageChange,
  setPage
}) => (
  <Provider>
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>
          <Text>Dessert</Text>
        </DataTable.Title>
        <DataTable.Title numeric>
          <Text>Calories</Text>
        </DataTable.Title>
        <DataTable.Title numeric>
          <Text>Fat</Text>
        </DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
          <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(p) => setPage(p)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  </Provider>
)

const meta: Meta<TableExampleInterface> = {
  title: 'DataTable',
  component: TableExample,
  decorators: [
    (Story) => {
      const [page, setPage] = useState<number>(0)
      const [numberOfItemsPerPageList] = useState([2, 3, 4])
      const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0])

      const items = [
        {
          key: 1,
          name: 'Cupcake',
          calories: 356,
          fat: 16
        },
        {
          key: 2,
          name: 'Eclair',
          calories: 262,
          fat: 16
        },
        {
          key: 3,
          name: 'Frozen yogurt',
          calories: 159,
          fat: 6
        },
        {
          key: 4,
          name: 'Gingerbread',
          calories: 305,
          fat: 3.7
        }
      ]

      const from = page * itemsPerPage
      const to = Math.min((page + 1) * itemsPerPage, items.length)

      useEffect(() => {
        setPage(0)
      }, [itemsPerPage])

      return (
        <Story
          args={{
            items,
            page,
            from,
            to,
            numberOfItemsPerPageList,
            itemsPerPage,
            onItemsPerPageChange,
            setPage
          }}
        />
      )
    }
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
