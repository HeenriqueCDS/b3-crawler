import { handler } from '@/functions/scheduled-importer'

describe('scheduled-importer', () => {
  it('should be defined', () => {
    expect(handler).toBeDefined()
  })
})
