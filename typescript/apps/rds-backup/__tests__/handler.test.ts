import { uploadBackupRequest } from '../src/handler.js'

describe.skip('send request tests', () => {
  it('should call getS3File', async () => {
    // @ts-ignore
    await expect(uploadBackupRequest({}, { logger: console })).rejects.toThrow(
      `Error getting object test from bucket test. Make sure they exist and your bucket is in the same region as this function.`
    )
  })
})
