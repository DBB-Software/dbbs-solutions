import React, { FormEventHandler, FC } from 'react'
import { Controller, Control, FieldErrors, FieldValues } from 'react-hook-form'
import { TextField, Typography, FormControl, FormControlLabel, Checkbox, Button, Grid } from '@dbbs/mui-components'
import { CustomAutocomplete, Option } from '../CustomAutocomplete'
import { DEFAULT_CONFIG_PAGE_GRID_SIZE } from '../../utils'
import { GEO_CONFIG_FORM_TEST_IDS } from './testIds'

export interface GeoConfigFormProps {
  isUpdateLoading: boolean
  control?: Control<FieldValues>
  handleSubmit: FormEventHandler<HTMLFormElement>
  errors: FieldErrors
  onParentSearch: (searchTerm: string) => void
  parentSearchLoading: boolean
  parentOptions: Option[]
  onMeetingTypeSearch: (searchTerm: string) => void
  meetingTypeSearchLoading: boolean
  meetingTypeOptions: Option[]
}

export const GeoConfigForm: FC<GeoConfigFormProps> = ({
  isUpdateLoading,
  control,
  handleSubmit,
  errors,
  onParentSearch,
  parentSearchLoading,
  parentOptions,
  onMeetingTypeSearch,
  meetingTypeSearchLoading,
  meetingTypeOptions
}) => (
  <form onSubmit={handleSubmit} data-testid={GEO_CONFIG_FORM_TEST_IDS.FORM}>
    <Grid container spacing={2}>
      <Grid xs={12} item>
        <Typography variant="h4">Geo Configuration</Typography>
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <CustomAutocomplete
          name="meetingType"
          control={control}
          label="Meeting Type"
          options={meetingTypeOptions}
          data-testid={GEO_CONFIG_FORM_TEST_IDS.GEO_TYPE}
          onSearch={onMeetingTypeSearch}
          loading={meetingTypeSearchLoading}
          idKey="id"
          labelKey="name"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="timezone"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.TIMEZONE}>
              <TextField {...field} label="Time Zone" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <CustomAutocomplete
          name="parent"
          control={control}
          label="Parent"
          options={parentOptions}
          data-testid={GEO_CONFIG_FORM_TEST_IDS.PARENT}
          onSearch={onParentSearch}
          loading={parentSearchLoading}
          idKey="id"
          labelKey="name"
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="statusSchedule"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.STATUS_SCHEDULE}>
              <TextField {...field} label="Schedule Status" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="statusStream"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.STATUS_STREAM}>
              <TextField {...field} label="Stream Status" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="detectStartMethod"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.DETECT_START_METHOD}>
              <TextField {...field} label="Detect Start Method" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="detectEndMethod"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.DETECT_END_METHOD}>
              <TextField {...field} label="Detect End Method" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
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

      <Grid {...DEFAULT_CONFIG_PAGE_GRID_SIZE} item>
        <Controller
          name="scheduleFormat"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth data-testid={GEO_CONFIG_FORM_TEST_IDS.SCHEDULE_FORMAT}>
              <TextField {...field} label="Schedule Format" fullWidth />
            </FormControl>
          )}
        />
      </Grid>

      <Grid xs={12} item>
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
