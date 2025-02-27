const TEST_ID_PREFIX = 'data-table'

export const DATA_TABLE_TEST_IDS = {
  HEADER: `${TEST_ID_PREFIX}-header`,
  CREATE_VIEW_BUTTON: `${TEST_ID_PREFIX}-create-view-button`,
  CREATE_VIEW_INPUT: `${TEST_ID_PREFIX}-create-view-input`,
  VIEWS: `${TEST_ID_PREFIX}-views`,
  getViewTestId: (name: string) => `${TEST_ID_PREFIX}-${name}-view`,
  getDeleteViewButtonTestId: (name: string) => `${TEST_ID_PREFIX}-${name}-delete-view-button`,
  getSaveButtonTestId: (id: string) => `${TEST_ID_PREFIX}-${id}-save-button`,
  getCancelButtonTestId: (id: string) => `${TEST_ID_PREFIX}-${id}-cancel-button`,
  getEditButtonTestId: (id: string) => `${TEST_ID_PREFIX}-${id}-edit-button`,
  getDeleteButtonTestId: (id: string) => `${TEST_ID_PREFIX}-${id}-delete-button`,
  getStopButtonTestId: (id: string) => `${TEST_ID_PREFIX}-${id}-stop-button`
}
