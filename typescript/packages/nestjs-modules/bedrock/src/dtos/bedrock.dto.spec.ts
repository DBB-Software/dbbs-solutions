import { validate } from 'class-validator'
import { ChatRequestDto } from './bedrock-request.dto.js'
import { ChatResponseDto } from './bedrock-response.dto.js'

describe('ChatRequestDto', () => {
  it('should validate with correct data', async () => {
    const dto = new ChatRequestDto()
    dto.promptText = 'Valid prompt'
    dto.input = 'Valid input'

    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should fail validation when promptText is missing', async () => {
    const dto = new ChatRequestDto()
    dto.input = 'Valid input'
    // promptText is missing

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('promptText')
  })

  it('should fail validation when input is missing', async () => {
    const dto = new ChatRequestDto()
    dto.promptText = 'Valid prompt'
    // input is missing

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('input')
  })

  it('should fail validation when promptText is empty', async () => {
    const dto = new ChatRequestDto()
    dto.promptText = ''
    dto.input = 'Valid input'

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('promptText')
  })

  it('should fail validation when input is empty', async () => {
    const dto = new ChatRequestDto()
    dto.promptText = 'Valid prompt'
    dto.input = ''

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('input')
  })

  it('should fail validation when promptText is not a string', async () => {
    const dto = new ChatRequestDto()
    ;(dto as any).promptText = 123 // Type violation
    dto.input = 'Valid input'

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('promptText')
  })

  it('should fail validation when input is not a string', async () => {
    const dto = new ChatRequestDto()
    dto.promptText = 'Valid prompt'
    ;(dto as any).input = 123 // Type violation

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('input')
  })
})

describe('ChatResponseDto', () => {
  it('should validate with correct data', async () => {
    const dto = new ChatResponseDto()
    dto.output = 'Valid output'

    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should fail validation when output is empty', async () => {
    const dto = new ChatResponseDto()
    dto.output = ''

    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('output')
  })
})
