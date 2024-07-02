import React, { useState, useEffect, useCallback } from 'react'
import { request } from '@strapi/helper-plugin'
import { Button, Select, Option, TextInput } from '@strapi/design-system'
import { Container, Title, Form, ActionsContainer, PermissionsList, PermissionsTitle, PermissionsItem } from './styles'

interface Permissions {
  [key: string]: string[]
}

interface Role {
  id: string
  name: string
}

const PermissionsManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [role, setRole] = useState<string>('')
  const [plugin, setPlugin] = useState<string>('')
  const [api, setApi] = useState<string>('')
  const [controller, setController] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [permissions, setPermissions] = useState<Permissions>({})

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await request('/users-permissions/roles', { method: 'GET' })
        setRoles(fetchedRoles.roles)
      } catch (error) {
        console.error('Failed to fetch roles', error)
      }
    }

    fetchRoles()
  }, [])

  const handleRoleChange = useCallback((value: string) => {
    setRole(value)
  }, [])

  const handlePluginChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlugin(e.target.value)
    setApi('')
  }, [])

  const handleApiChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApi(e.target.value)
    setPlugin('')
  }, [])

  const handleControllerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setController(e.target.value)
  }, [])

  const handleActionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAction(e.target.value)
  }, [])

  const handleAddPermission = useCallback(() => {
    const permission = plugin ? `plugin::${plugin}.${controller}.${action}` : `api::${api}.${controller}.${action}`

    setPermissions((prevPermissions) => {
      const hasRolePermissions = Object.keys(prevPermissions).some((key) => key !== '')
      const hasNoRolePermissions = Object.keys(prevPermissions).includes('')

      if ((role && hasNoRolePermissions) || (!role && hasRolePermissions)) {
        alert('Cannot mix permissions with and without roles.')
        return prevPermissions
      }

      const updatedPermissions = { ...prevPermissions }
      if (!updatedPermissions[role]) {
        updatedPermissions[role] = []
      }
      if (!updatedPermissions[role].includes(permission)) {
        updatedPermissions[role].push(permission)
      }

      return updatedPermissions
    })
  }, [role, plugin, api, controller, action])

  const handleSubmitPermissions = useCallback(async () => {
    try {
      const permissionsConfig = { permissions }

      if (role) {
        await request('/permissions-manager/add-permissions', { method: 'POST', body: { permissionsConfig } })
      } else {
        const actions = Object.values(permissions).flat()

        await request('/permissions-manager/create-permissions', {
          method: 'POST',
          body: actions
        })
      }

      alert('Permissions submitted successfully')
    } catch (error) {
      alert('Failed to submit permissions')
    }
  }, [permissions, role])

  return (
    <Container>
      <Title>Manage Permissions</Title>
      <Form>
        <Select label="Role" name="role" onChange={handleRoleChange} value={role}>
          <Option value="">Select a role</Option>
          {roles.map((role) => (
            <Option key={role.id} value={role.name}>
              {role.name}
            </Option>
          ))}
        </Select>
        <TextInput label="Plugin" name="plugin" onChange={handlePluginChange} value={plugin} disabled={api !== ''} />
        <TextInput label="API" name="api" onChange={handleApiChange} value={api} disabled={!!plugin} />
        <TextInput label="Controller" name="controller" onChange={handleControllerChange} value={controller} />
        <TextInput label="Action" name="action" onChange={handleActionChange} value={action} />
        <ActionsContainer>
          <Button onClick={handleAddPermission}>Add Permission</Button>
          <Button onClick={handleSubmitPermissions}>Submit Permissions</Button>
        </ActionsContainer>
      </Form>

      <PermissionsList>
        <PermissionsTitle>Current Permissions</PermissionsTitle>
        <ul>
          {Object.entries(permissions).map(([role, actions], index) => (
            <PermissionsItem key={index}>
              <strong>Role {role}:</strong>
              <ul>
                {actions.map((action, idx) => (
                  <PermissionsItem key={idx}>{action}</PermissionsItem>
                ))}
              </ul>
            </PermissionsItem>
          ))}
        </ul>
      </PermissionsList>
    </Container>
  )
}

export default PermissionsManager
