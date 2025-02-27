import React, { FC, useState, useEffect } from 'react'
import { Autocomplete, TextField, CircularProgress } from '@dbbs/mui-components'
import { Control, Controller, ControllerRenderProps, FieldError, FieldValues } from 'react-hook-form'

export interface Option {
  [key: string]: string | number | boolean | null | undefined
}

export interface AutoCompleteFieldProps {
  name: string
  control?: Control<FieldValues>
  label: string
  options: Option[]
  loading?: boolean
  rules?: Record<string, unknown>
  onSearch?: (searchText: string) => void
  idKey?: string
  labelKey?: string
}

const ControlledAutocomplete: FC<{
  field: ControllerRenderProps<FieldValues, string>
  fieldState: { error?: FieldError }
  options: Option[]
  onSearch?: (searchText: string) => void
  loading?: boolean
  label: string
  idKey?: string
  labelKey?: string
}> = ({ field, fieldState, options, onSearch, loading, label, idKey = 'id', labelKey = 'fullName' }) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  useEffect(() => {
    if (field.value && !inputValue) {
      const findOption = () => options.find((opt) => opt[idKey] === field.value[idKey]) || field.value

      const defaultOption = findOption()

      setSelectedOption(defaultOption || null)
      setInputValue(defaultOption?.[labelKey] || '')
    }
  }, [field.value, options, idKey, labelKey, inputValue])

  const handleInputChange = (_: unknown, value: string, reason: string) => {
    if (reason === 'input') {
      setSelectedOption(null)
    }
    if (reason === 'reset') {
      return
    }
    setInputValue(value)
    onSearch?.(value)
  }

  const handleChange = (_: unknown, value: Option | null) => {
    setSelectedOption(value)
    field.onChange(value ? { id: value[idKey], ...value } : null)
  }

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option?.[labelKey]?.toString() || ''}
      isOptionEqualToValue={(option, value) => option?.[idKey]?.toString() === value?.[idKey]}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      value={selectedOption}
      inputValue={inputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          fullWidth
        />
      )}
    />
  )
}

export const CustomAutocomplete: FC<AutoCompleteFieldProps> = ({
  name,
  control,
  label,
  options,
  loading = false,
  rules = {},
  onSearch,
  idKey = 'id',
  labelKey = 'fullName'
}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <ControlledAutocomplete
        field={field}
        fieldState={fieldState}
        options={options}
        loading={loading}
        label={label}
        onSearch={onSearch}
        idKey={idKey}
        labelKey={labelKey}
      />
    )}
  />
)
