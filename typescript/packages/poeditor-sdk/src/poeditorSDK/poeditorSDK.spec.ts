import { POEditorSDK } from './poeditorSDK'

describe('POEditorSDK', () => {
  const apiToken = 'test-api-token'
  const projectId = 12345

  it('should throw an error if apiToken is missing', () => {
    expect(() => new POEditorSDK('', projectId)).toThrow('API token is required to initialize POEditorSDK.')
  })

  it('should throw an error if projectId is empty for methods that require projectId', async () => {
    const sdk = new POEditorSDK(apiToken, '')
    await expect(sdk.viewProject()).rejects.toThrow('Project ID is required for this operation.')
  })

  it('should create an instance with correct values', () => {
    const sdk = new POEditorSDK(apiToken, projectId)

    expect(sdk).toBeInstanceOf(POEditorSDK)
    expect(sdk).toHaveProperty('apiToken', apiToken)
    expect(sdk).toHaveProperty('projectId', projectId)
  })
})
