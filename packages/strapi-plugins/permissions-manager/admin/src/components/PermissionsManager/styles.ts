import styled from 'styled-components'

export const Container = styled.div`
  max-width: 800px;
  padding: 2rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral900};
`

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`

export const PermissionsList = styled.div`
  margin-top: 2rem;
`

export const PermissionsTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral900};
`

export const PermissionsItem = styled.li`
  list-style: none;
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral900};
`
