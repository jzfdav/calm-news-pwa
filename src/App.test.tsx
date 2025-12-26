import { render, screen } from '@testing-library/react'
import App from './App'
import { expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hook to bypass data fetching
vi.mock('./engine/hooks', () => ({
    useNewsFeed: () => ({
        data: {
            sections: [{
                id: '1',
                name: 'Test Section',
                articles: [{ id: 'a1', title: 'Test Article', content: '...', link: '...', pubDate: '', source: 'Test' }]
            }],
            customFeeds: []
        },
        isLoading: false,
    }),
    useReader: () => ({
        theme: 'light',
        fontSize: 'm',
        setTheme: vi.fn(),
        setFontSize: vi.fn(),
        readArticles: [],
        markAsRead: vi.fn(),
    })
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
