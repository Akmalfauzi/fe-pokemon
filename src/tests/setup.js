import { config } from '@vue/test-utils'

config.global.mocks = {
    $route: {
        params: {}
    },
    $router: {
        push: vi.fn()
    }
}
