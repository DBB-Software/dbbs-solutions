import { renderRouter, screen, act } from '../testUtils/customRender'

describe.skip('<App />', () => {
  it('should render properly', async () => {
    await act(async () => {
      await renderRouter({ path: '/' })
    })

    await screen.findByText('Sample APP')
  })
})
