import React, { FormEventHandler, FC } from 'react'
import { Controller, Control, FieldErrors, FieldValues } from 'react-hook-form'
import { TextField, Typography, FormControl, FormControlLabel, Checkbox, Button, Grid } from '@dbbs/mui-components'
import { CustomAutocomplete, Option } from '../CustomAutocomplete'
import { DEFAULT_CONFIG_PAGE_GRID_SIZE } from '../../utils'
import { GEO_CONFIG_FORM_TEST_IDS } from './testIds'

export interface ProductConfigFormProps {
  isUpdateLoading: boolean
  control?: Control<FieldValues>
  handleSubmit: FormEventHandler<HTMLFormElement>
  errors: FieldErrors
  onTypeSearch: (searchTerm: string) => void
  typeSearchLoading: boolean
  typeOptions: Option[]
}

export const ProductConfigForm: FC<ProductConfigFormProps> = ({
  isUpdateLoading,
  control,
  handleSubmit,
  errors,
  onTypeSearch,
  typeSearchLoading,
  typeOptions
}) => (
  <form onSubmit={handleSubmit} data-testid={GEO_CONFIG_FORM_TEST_IDS.FORM}>
    <Grid container spacing={2}>
      <Grid xs={12} item>
        <Typography variant="h4">Product Configuration</Typography>
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField
                {...field}
                label="Name"
                error={!!errors.name}
                fullWidth
                data-testid={GEO_CONFIG_FORM_TEST_IDS.NAME}
                InputLabelProps={{ shrink: !!field.value }}
              />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField {...field} label="Description" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField {...field} label="Price" type="number" fullWidth InputLabelProps={{ shrink: !!field.value }} />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField {...field} label="Currency" fullWidth InputLabelProps={{ shrink: !!field.value }} />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="sku"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField {...field} label="SKU" fullWidth InputLabelProps={{ shrink: !!field.value }} />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="inventoryCount"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField
                {...field}
                label="Inventory Count"
                type="number"
                fullWidth
                InputLabelProps={{ shrink: !!field.value }}
              />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <TextField {...field} label="Image URL" fullWidth InputLabelProps={{ shrink: !!field.value }} />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <FormControlLabel
          control={
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => <Checkbox {...field} checked={!!field.value} />}
            />
          }
          label="Is Active"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <CustomAutocomplete
          name="type"
          control={control}
          label="Type"
          options={typeOptions}
          onSearch={onTypeSearch}
          loading={typeSearchLoading}
          idKey="id"
          labelKey="name"
        />
      </Grid>

      <Grid xs={12} item>
        <Button type="submit" variant="contained" fullWidth disabled={isUpdateLoading}>
          {isUpdateLoading ? 'Loading...' : 'Save'}
        </Button>
      </Grid>
    </Grid>
  </form>
)
