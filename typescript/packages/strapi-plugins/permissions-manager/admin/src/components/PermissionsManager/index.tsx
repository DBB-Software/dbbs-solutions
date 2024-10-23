import React, { useEffect, useState } from 'react'
import { Flex } from '@strapi/design-system/Flex'
import { Button, Select, Option, TextInput, Typography, Box, HeaderLayout } from '@strapi/design-system'
import { ApiService } from '../../services/api'
import { AddPermissionsInterface, Permission } from '../../interfaces/permissions'

interface Permissions {
  [key: string]: Permission[]
}

interface Role {
  id: string
  name: string
}

const _allKey = '_ALL'

const PermissionsManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [role, setRole] = useState<string>('')
  const [plugin, setPlugin] = useState<string>('')
  const [api, setApi] = useState<string>('')
  const [controller, setController] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [permissions, setPermissions] = useState<Permissions>({})

  useEffect(() => {
    async function fetchRoles() {
      const fetchedRoles = await ApiService.getRoles().catch((error: any) => {
        console.error('Failed to fetch roles', error)
      })
      setRoles(fetchedRoles.roles)
    }
    fetchRoles()
  }, [])

  const handleRoleChange = (value: string) => {
    setRole(value)
  }
  const handlePluginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlugin(e.target.value)
    setApi('')
  }
  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApi(e.target.value)
    setPlugin('')
  }
  const handleControllerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setController(e.target.value)
  }
  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAction(e.target.value)
  }

  const handleAddPermission = () => {
    if ([action, controller, api || plugin].some((el) => el === '')) {
      return
    }
    const formattedPermission = plugin
      ? `plugin::${plugin}.${controller}.${action}`
      : `api::${api}.${controller}.${action}`
    const permission = {
      controller,
      action,
      permissionString: formattedPermission,
      plugin,
      api
    } satisfies Permission

    setPermissions((prevPermissions) => {
      const roleName = role || _allKey
      const updatedPermissions = { ...prevPermissions }
      if (!updatedPermissions[roleName]) {
        updatedPermissions[roleName] = []
      }
      if (!updatedPermissions[roleName].some((el) => el.permissionString === formattedPermission)) {
        updatedPermissions[roleName].push(permission)
      }
      return updatedPermissions
    })
    setPlugin('')
    setApi('')
    setController('')
    setAction('')
    setRole('')
  }

  const deletePermissions = (role: string, permissionString: Permission['permissionString']) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions }
      const rolePermissions = updatedPermissions[role]
      const updatedRolePermissions = rolePermissions.filter((el) => el.permissionString !== permissionString)
      if (updatedRolePermissions.length === 0) {
        const { [role]: _, ...restPermissions } = updatedPermissions
        return restPermissions
      } else {
        updatedPermissions[role] = updatedRolePermissions
        return updatedPermissions
      }
    })
  }

  const handleSubmitPermissions = async () => {
    try {
      let submitPermissions = permissions
      if (submitPermissions[_allKey]) {
        await ApiService.createPermissions(submitPermissions[_allKey].map((permission) => permission.permissionString))
        const { [_allKey]: _, ...restPermissions } = permissions
        submitPermissions = restPermissions
      }
      if (Object.keys(submitPermissions).length) {
        const transformedPermissions = Object.keys(submitPermissions).reduce(
          (acc: AddPermissionsInterface, key: string) => {
            acc[key] = permissions[key].map((permission) => permission.permissionString)
            return acc
          },
          {}
        )
        await ApiService.addPermissions(transformedPermissions)
      }
    } catch (error) {
      alert('Failed to submit permissions')
      return
    }

    alert('Permissions submitted successfully')
    setPermissions({})
  }

  const filledInputs = !((plugin || api) && controller && action)
  return (
    <Box padding={8}>
      <HeaderLayout title="Manage Permissions" />
      <Box padding={4} marginBottom={4} background="neutral0">
        <Flex gap={8} alignItems="stretch" marginBottom={4}>
          <Flex width={'100%'} gap={5} direction="column" alignItems="stretch">
            <Select label="Role" name="role" onChange={handleRoleChange} value={role}>
              <Option value="">Select a role</Option>
              {roles.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
            <TextInput label="Plugin" name="plugin" onChange={handlePluginChange} value={plugin} disabled={api} />
            <TextInput label="API" name="api" onChange={handleApiChange} value={api} disabled={!!plugin} />
          </Flex>
          <Flex width={'100%'} gap={5} direction="column" alignItems="stretch">
            <TextInput label="Controller" name="controller" onChange={handleControllerChange} value={controller} />
            <TextInput label="Action" name="action" onChange={handleActionChange} value={action} />
          </Flex>
        </Flex>
        <Button onClick={handleAddPermission} disabled={filledInputs}>
          Add Permission
        </Button>
      </Box>
      <Box>
        <Typography variant="beta" as="h2">
          Current Permissions
        </Typography>
        <Flex
          padding={6}
          marginTop={4}
          alignItems="flex-start"
          hasRadius
          background="neutral0"
          gap={4}
          direction="column"
        >
          {Object.entries(permissions).map(([role, actions], index) => (
            <Box width={'100%'} padding={2} borderColor="neutral200" borderStyle="solid" borderWidth="1px" key={index}>
              <Typography fontSize={20} as="h4" variant="sigma">
                Role {role}:
              </Typography>
              <Flex gap={4}>
                {actions.map(({ action, permissionString, controller, api, plugin }) => (
                  <Box
                    borderColor="primary500"
                    key={permissionString}
                    padding={4}
                    borderStyle="solid"
                    borderWidth="1px"
                  >
                    <Flex direction="column" alignItems="stretch" gap={2}>
                      <Typography variant="delta">Action: {action}</Typography>
                      <Typography variant="delta">Controller: {controller}</Typography>
                      <Typography variant="delta">{api ? `Api: ${api}` : `Plugin: ${plugin}`}</Typography>
                    </Flex>
                    <Button
                      background="secondary200"
                      right={2}
                      top={2}
                      padding={2}
                      onClick={() => {
                        deletePermissions(role, permissionString)
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
          <Button marginTop={4} disabled={!Object.keys(permissions).length} onClick={handleSubmitPermissions}>
            Submit Permissions
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default PermissionsManager
