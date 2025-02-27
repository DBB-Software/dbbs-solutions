import React, { FC } from 'react'
import { Controller, Control, FieldErrors, UseFormHandleSubmit, FieldValues } from 'react-hook-form'
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Grid
} from '@dbbs/mui-components'
import { CustomAutocomplete } from '../CustomAutocomplete'
import { DEFAULT_CONFIG_PAGE_GRID_SIZE } from '../../utils'
import { GEO_CONFIG_FORM_TEST_IDS } from './testIds'
import { Geo, LinkField } from '../../types'

export interface GeoConfigFormProps {
  geoTypes: string[]
  isUpdateLoading: boolean
  control?: Control<FieldValues, Geo>
  handleSubmit: UseFormHandleSubmit<Geo>
  errors: FieldErrors
  onSubmit: (data: Geo) => void

  onParentSearch: (searchTerm: string) => void
  parentSearchLoading: boolean
  parentOptions: LinkField[]
  streamTypeOptions: string[]
  detectMethods: string[]
  statuses: string[]
  timezones: string[]
  scheduleFormats: string[]
}

export const GeoConfigForm: FC<GeoConfigFormProps> = ({
  geoTypes,
  isUpdateLoading,
  control,
  handleSubmit,
  errors,
  onSubmit,
  onParentSearch,
  parentSearchLoading,
  parentOptions,
  detectMethods,
  statuses,
  timezones,
  scheduleFormats,
  streamTypeOptions
}) => (
  <form onSubmit={handleSubmit(onSubmit)} data-testid={GEO_CONFIG_FORM_TEST_IDS.FORM}>
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Typography variant="h4">Geo Configuration</Typography>
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              error={!!errors.name}
              fullWidth
              data-testid={GEO_CONFIG_FORM_TEST_IDS.NAME}
            />
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="geoType"
          control={control}
          rules={{ required: 'Geo Type is required' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.geoType} data-testid={GEO_CONFIG_FORM_TEST_IDS.GEO_TYPE}>
              <InputLabel id="geo-type-label">Geo Type</InputLabel>
              <Select {...field} label="Geo Type" fullWidth error={!!errors.geoType}>
                {geoTypes?.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="timezone"
          control={control}
          rules={{ required: 'Time Zone is required' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.timezone} data-testid={GEO_CONFIG_FORM_TEST_IDS.TIMEZONE}>
              <InputLabel id="timezone-label">Time Zone</InputLabel>
              <Select {...field} labelId="timezone-label" label="Time Zone" fullWidth>
                {timezones.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="scheduleUrl"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.SCHEDULE_URL}>
              <TextField {...field} label="Schedule URL" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="captureStreamFlag"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  data-testid={GEO_CONFIG_FORM_TEST_IDS.CAPTURE_STREAM_FLAG}
                />
              )}
            />
          }
          label="Capture Stream"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="jurisdiction"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.DEMO} />
              )}
            />
          }
          label="Jurisdiction"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="captureScheduleFlag"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  data-testid={GEO_CONFIG_FORM_TEST_IDS.CAPTURE_SCHEDULE_FLAG}
                />
              )}
            />
          }
          label="Capture Schedule"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="flagOnlyAgenda"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.FLAG_AGENDA} />
              )}
            />
          }
          label="Flag only agenda"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="flagOptInOnly"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.FLAG_OPT_IN} />
              )}
            />
          }
          label="Flag opt in only"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="flagLive"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.FLAG_LIVE} />
              )}
            />
          }
          label="Flag Live"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="debug"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.DEBUG} />
              )}
            />
          }
          label="Debug"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <FormControlLabel
          control={
            <Controller
              name="demo"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={!!field.value} data-testid={GEO_CONFIG_FORM_TEST_IDS.DEMO} />
              )}
            />
          }
          label="Demo"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="streamType"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.statusStream} data-testid={GEO_CONFIG_FORM_TEST_IDS.STREAM_TYPE}>
              <InputLabel>Stream Type</InputLabel>
              <Select {...field} label="Stream Type" fullWidth>
                {streamTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <CustomAutocomplete
          name="parent"
          control={control}
          rules={{ required: 'Parent is required' }}
          label="Parent"
          options={parentOptions}
          data-testid={GEO_CONFIG_FORM_TEST_IDS.PARENT}
          onSearch={onParentSearch}
          loading={parentSearchLoading}
          idKey="id"
          labelKey="fullName"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="channelUrl"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.CHANNEL_URL}>
              <TextField {...field} label="Channel URL" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="statusSchedule"
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              error={!!errors.statusSchedule}
              data-testid={GEO_CONFIG_FORM_TEST_IDS.STATUS_SCHEDULE}
            >
              <InputLabel>Schedule Status</InputLabel>
              <Select {...field} label="Schedule Status" fullWidth>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="statusStream"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.statusStream} data-testid={GEO_CONFIG_FORM_TEST_IDS.STATUS_STREAM}>
              <InputLabel>Stream Status</InputLabel>
              <Select {...field} label="Stream Status" fullWidth>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="detectStartMethod"
          control={control}
          rules={{ required: 'Detect Start Method is required' }}
          render={({ field }) => (
            <FormControl
              fullWidth
              error={!!errors.detectStartMethod}
              data-testid={GEO_CONFIG_FORM_TEST_IDS.DETECT_START_METHOD}
            >
              <InputLabel id="detect-start-method-label">Detect Start Method</InputLabel>
              <Select {...field} label="Detect Start Method" fullWidth>
                {detectMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="detectEndMethod"
          control={control}
          rules={{ required: 'Detect End Method is required' }}
          render={({ field }) => (
            <FormControl
              fullWidth
              error={!!errors.detectEndMethod}
              data-testid={GEO_CONFIG_FORM_TEST_IDS.DETECT_END_METHOD}
            >
              <InputLabel id="detect-end-method-label">Detect End Method</InputLabel>
              <Select {...field} label="Detect End Method" fullWidth>
                {detectMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="scheduleRefreshFrequency"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.SCHEDULE_REFRESH_FREQUENCY}>
              <TextField
                label="Schedule Refresh Frequency"
                type="number"
                {...field}
                fullWidth
                inputProps={{ inputLabel: { shrink: true } }}
              />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="detectEndOcrString"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.DETECT_END_OCR}>
              <TextField label="Detect end OCR" {...field} fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="singlePlayerUrl"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.SINGLE_PLAYER_URL}>
              <TextField label="Single player URL" {...field} fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE}>
        <Controller
          name="scheduleFormat"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.SCHEDULE_FORMAT}>
              <InputLabel>Schedule Format</InputLabel>
              <Select {...field} label="Schedule Format" fullWidth>
                {scheduleFormats.map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid xs={12}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isUpdateLoading}
          data-testid={GEO_CONFIG_FORM_TEST_IDS.SUBMIT_BUTTON}
        >
          {isUpdateLoading ? 'Loading...' : 'Save'}
        </Button>
      </Grid>
    </Grid>
  </form>
)
