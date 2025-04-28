import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate, useParams } from '@tanstack/react-router'
import { skipToken } from '@reduxjs/toolkit/query'
import { debounce } from '@dbbs/mui-components'
import {
  useCreateGeoMutation,
  useGetGeoByIdQuery,
  useGetGeoListQuery,
  useGetMeetingTypeListQuery,
  useUpdateGeoMutation
} from '../../data-access'
import { GeoConfigForm } from '../../ui'
import { displayValidationErrors } from '../../utils'
import { Geo, ListPayload } from '../../types'

const defaultValues: Geo = {
  id: '',
  bubbleId: '',
  name: '',
  scheduleUrl: '',
  detectStartMethod: '',
  detectEndMethod: '',
  statusSchedule: '',
  timezone: '',
  jurisdiction: false,
  channelUrl: '',
  scheduleFormat: '',
  statusStream: '',
  flagOnlyAgenda: false,
  flagOptInOnly: false,
  singlePlayerUrl: '',
  flagLive: false,
  detectEndOcrString: '',
  debug: false,
  demo: false,
  streamType: ''
}

export const GeoEditPage: FC = () => {
  const navigate = useNavigate({ from: '/geo/create' })

  const [updateGeo, { isLoading: isUpdateLoading }] = useUpdateGeoMutation()
  const [createGeo, { isLoading: isCreateGeoLoading }] = useCreateGeoMutation()

  const { geoId } = useParams({ strict: false })

  const { data: defaultGeo } = useGetGeoByIdQuery(geoId || skipToken)

  const geo = useMemo(
    () => ({
      ...defaultGeo,
      parent: {
        name: defaultGeo?.parent?.name
      }
    }),
    [defaultGeo]
  )

  const [parentSearchTerm, setParentSearchTerm] = useState<string>('')
  const [meetingTypeSearchTerm, setMeetingTypeSearchTerm] = useState<string>('')

  const baseOptionsQuery: ListPayload = {
    limit: 10,
    offset: 0,
    filterField: 'name',
    filterOperator: 'contains'
  }

  const {
    data: parentData,
    isLoading: isParentLoading,
    isFetching: isParentFetching
  } = useGetGeoListQuery({ ...baseOptionsQuery, filterValue: parentSearchTerm })

  const {
    data: meetingTypeData,
    isLoading: isMeetingTypeLoading,
    isFetching: isMeetingTypeFetching
  } = useGetMeetingTypeListQuery({ ...baseOptionsQuery, filterValue: meetingTypeSearchTerm })

  const handleParentSearchTermChange = useCallback((searchText: string) => {
    debounce(() => {
      setParentSearchTerm(searchText)
    }, 300)
  }, [])

  const handleMeetingTypeSearchTermChange = useCallback((searchText: string) => {
    debounce(() => {
      setMeetingTypeSearchTerm(searchText)
    }, 300)
  }, [])

  const parentSearchOptions =
    parentData?.results.map(({ id, name }) => ({
      id,
      name
    })) || []

  const meetingTypeSearchOptions =
    meetingTypeData?.results.map(({ id, name }) => ({
      id,
      name
    })) || []

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FieldValues>({
    defaultValues
  })

  useEffect(() => {
    if (geo) {
      reset(geo)
    }
  }, [geo, reset])

  const onSubmit = (item: FieldValues) => {
    const { parent, meetingType, ...validGeo } = item

    if (!geoId) {
      createGeo({
        ...validGeo,
        geoParentId: item.parent?.id ? Number(item.parent?.id) : undefined,
        meetingTypeId: item.meetingType?.id ? Number(item.meetingType?.id) : undefined,
        scheduleRefreshFrequency: Number(item.scheduleRefreshFrequency)
      })
        .unwrap()
        .then(({ id }) => {
          navigate({ to: `/geo/${id}/edit` })
        })
        .catch(displayValidationErrors)
    } else {
      updateGeo({
        id: geoId,
        item: {
          ...validGeo,
          geoParentId: item.parent?.id ? Number(item.parent?.id) : undefined,
          meetingTypeId: item.meetingType?.id ? Number(item.meetingType?.id) : undefined,
          scheduleRefreshFrequency: Number(item.scheduleRefreshFrequency)
        }
      })
        .unwrap()
        .catch(displayValidationErrors)
    }
  }

  return (
    <GeoConfigForm
      isUpdateLoading={isUpdateLoading || isCreateGeoLoading}
      control={control}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      onParentSearch={handleParentSearchTermChange}
      parentSearchLoading={isParentLoading || isParentFetching}
      parentOptions={parentSearchOptions}
      onMeetingTypeSearch={handleMeetingTypeSearchTermChange}
      meetingTypeSearchLoading={isMeetingTypeLoading || isMeetingTypeFetching}
      meetingTypeOptions={meetingTypeSearchOptions}
    />
  )
}
