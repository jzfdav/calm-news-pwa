import { render, screen } from '@testing-library/react'
import App from './App'
import { expect, test } from 'vitest'

test('renders Calm News heading', () => {
    render(<App />)
    const headingElement = screen.getByText(/Calm News/i)
    expect(headingElement).toBeInTheDocument()
})
