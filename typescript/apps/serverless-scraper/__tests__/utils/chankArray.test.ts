import { chunkArray } from "../../src/utils/chunkArray"

describe('chunkArray', () => {
  it('should split an array into chunks of the specified size', () => {
    const input = [1, 2, 3, 4, 5, 6, 7]
    const chunkSize = 3
    const result = chunkArray(input, chunkSize)
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]])
  })

  it('should return an empty array when input is empty', () => {
    const result = chunkArray([], 3)
    expect(result).toEqual([])
  })

  it('should return the original array in one chunk if chunkSize >= array.length', () => {
    const input = [1, 2, 3]
    expect(chunkArray(input, 3)).toEqual([[1, 2, 3]])
    expect(chunkArray(input, 5)).toEqual([[1, 2, 3]])
  })

  it('should handle chunkSize of 1 (each element in its own chunk)', () => {
    const input = [1, 2, 3]
    expect(chunkArray(input, 1)).toEqual([[1], [2], [3]])
  })

  it('should handle chunkSize larger than array length', () => {
    const input = [1, 2]
    expect(chunkArray(input, 10)).toEqual([[1, 2]])
  })

  it('should throw or behave as expected for invalid chunkSize (0 or negative)', () => {
    const input = [1, 2, 3]
    expect(() => chunkArray(input, 0)).toThrow()
    expect(() => chunkArray(input, -2)).toThrow()
  })
})