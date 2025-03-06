import React from 'react'
import {
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowModesModel,
  GridTreeNodeWithRender,
  GridValidRowModel
} from '@dbbs/mui-components'
import { Pencil, Save, Trash2, X } from 'lucide-react'
import { ActionButtons, DATA_TABLE_TEST_IDS } from '../../ui'

export type RenderDefaultActionsProps = {
  params: GridRenderCellParams<GridValidRowModel, unknown, unknown, GridTreeNodeWithRender>
  rowModesModel: GridRowModesModel
  handleSaveClick?: (rowId: string) => void
  handleCancelClick?: (rowId: string) => void
  handleEditClick?: (rowId: string) => void
  handleDeleteClick?: (rowId: string) => void
}

export const renderDefaultActions = ({
  params,
  rowModesModel,
  handleSaveClick,
  handleCancelClick,
  handleDeleteClick,
  handleEditClick
}: RenderDefaultActionsProps) => {
  const rowId = params.id.toString()
  const isEditMode = rowModesModel[rowId]

  return (
    <ActionButtons rowId={rowId}>
      <>
        {isEditMode ? (
          <>
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={() => handleSaveClick?.(rowId)}
              sx={{ color: 'inherit' }}
              data-testid={DATA_TABLE_TEST_IDS.getSaveButtonTestId(rowId)}
            />
            <GridActionsCellItem
              icon={<X />}
              label="Cancel"
              onClick={() => handleCancelClick?.(rowId)}
              sx={{ color: 'inherit' }}
              data-testid={DATA_TABLE_TEST_IDS.getCancelButtonTestId(rowId)}
            />
          </>
        ) : (
          <>
            <GridActionsCellItem
              icon={<Pencil />}
              label="Edit"
              onClick={() => handleEditClick?.(rowId)}
              sx={{ color: 'inherit' }}
              data-testid={DATA_TABLE_TEST_IDS.getEditButtonTestId(rowId)}
            />
            <GridActionsCellItem
              icon={<Trash2 />}
              label="Delete"
              onClick={() => handleDeleteClick?.(rowId)}
              sx={{ color: 'inherit' }}
              data-testid={DATA_TABLE_TEST_IDS.getDeleteButtonTestId(rowId)}
            />
          </>
        )}
      </>
    </ActionButtons>
  )
}
