import React, { FC } from 'react'
import { Button, GridToolbar, GridToolbarContainer } from '@dbbs/mui-components'
import { Plus } from 'lucide-react'

import { DATA_TABLE_TOOLBAR_TEST_IDS } from './testIds'

export interface EditToolbarProps {
  selectedRows: string[]
  showAddButton: boolean
  showImportButton?: boolean
  importLoading?: boolean
  handleFileDrop?: (content: File) => void
  handleAddClick?: () => void
  handleDeleteSelectedClick?: () => void
}

export const EditToolbar: FC<EditToolbarProps> = ({ handleAddClick, showAddButton = true }) => (
  <GridToolbarContainer sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
    {showAddButton && (
      <Button
        variant="contained"
        color="primary"
        data-testid={DATA_TABLE_TOOLBAR_TEST_IDS.ADD_BUTTON}
        startIcon={<Plus />}
        onClick={handleAddClick}
      >
        Add record
      </Button>
    )}
    <GridToolbar />
  </GridToolbarContainer>
)
