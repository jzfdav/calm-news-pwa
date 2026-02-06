import { render, screen } from '@testing-library/react'
import App from './App'
import { expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const digest = {
    date: '2026-01-01',
    sections: [{
        id: '1',
        name: 'Test Section',
        articles: [{ id: 'a1', title: 'Test Article', content: '...', link: '...', pubDate: '', source: 'Test' }]
    }]
}

// Mock the hook to bypass data fetching
vi.mock('./engine/hooks', () => ({
    useNewsFeed: () => ({
        data: digest,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
    }),
}))

vi.mock('./engine/storage', async (importOriginal) => {
    const actual = await importOriginal<typeof import('./engine/storage')>()
    return {
        ...actual,
        loadCustomFeeds: () => [],
        loadTopics: () => ['Technology'],
        loadSettings: () => ({ retentionDays: 7, maxArticlesPerSection: 10 }),
        pruneLegacyKeys: vi.fn(),
        clearStorage: vi.fn(),
    }
})

vi.mock('./engine/useConnectivity', () => ({
    useConnectivity: () => ({ isOffline: false }),
}))

test('renders Today\'s News heading', async () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    )

    // The feed branding "TODAY'S NEWS" should be present
    expect(await screen.findByText(/TODAY'S NEWS/i)).toBeInTheDocument()
})
