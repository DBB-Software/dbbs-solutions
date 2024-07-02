import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { StaticList, StaticListProps, DEFAULT_LIST_TEST_ID, CustomButton } from '../../src'

const listItem = <CustomButton icon={'camera'} text={'TEXT'} onPress={() => console.log('onPress')} />
const STATIC_LIST_DEFAULT_STATE: StaticListProps = {
  listItems: [
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem,
    listItem
  ]
}
const STATIC_LIST_HORIZONTAL_STATE: StaticListProps = { ...STATIC_LIST_DEFAULT_STATE, isHorizontal: true }
const STATIC_LIST_DEFAULT_INTERVAL_STATE: StaticListProps = { ...STATIC_LIST_DEFAULT_STATE, interval: 64 }
const STATIC_LIST_HORIZONTAL_INTERVAL_STATE: StaticListProps = { ...STATIC_LIST_HORIZONTAL_STATE, interval: 64 }
const STATIC_LIST_DEFAULT_INTERVAL_COLUMNS_STATE: StaticListProps = {
  ...STATIC_LIST_DEFAULT_INTERVAL_STATE,
  columns: 2
}
const STATIC_LIST_HORIZONTAL_INTEVAL_COLUMNS_STATE: StaticListProps = {
  ...STATIC_LIST_HORIZONTAL_INTERVAL_STATE,
  columns: 2
}

describe('Button Component', () => {
  it('renders correctly with default settings', () => {
    render(<StaticList {...STATIC_LIST_DEFAULT_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with horizontal settings state', () => {
    render(<StaticList {...STATIC_LIST_HORIZONTAL_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with default + interval settings state', () => {
    render(<StaticList {...STATIC_LIST_DEFAULT_INTERVAL_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with horizontal + inteval settings state', () => {
    render(<StaticList {...STATIC_LIST_HORIZONTAL_INTERVAL_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with default + interval + columns settings state', () => {
    render(<StaticList {...STATIC_LIST_DEFAULT_INTERVAL_COLUMNS_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with horizontal + inteval + columns settings state', () => {
    render(<StaticList {...STATIC_LIST_HORIZONTAL_INTEVAL_COLUMNS_STATE} />)

    expect(screen.getByTestId(DEFAULT_LIST_TEST_ID)).toBeTruthy()
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
