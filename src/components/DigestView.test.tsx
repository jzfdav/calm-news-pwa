import { render, screen, fireEvent } from '@testing-library/react'
import { DigestView } from './DigestView'
import { expect, test, vi, describe } from 'vitest'
import type { Section } from '../engine/types'

const MOCK_SECTIONS: Section[] = [
    {
        id: 's1',
        name: 'Tech News',
        rssUrl: '',
        articles: [
            { id: 'a1', title: 'Apple Silicon Update', content: '...', link: '...', pubDate: '', source: 'Tech' },
            { id: 'a2', title: 'Nvidia GPU Launch', content: '...', link: '...', pubDate: '', source: 'Tech' },
        ]
    },
    {
        id: 's2',
        name: 'Science',
        rssUrl: '',
        articles: [
            { id: 'a3', title: 'Mars Rover High-Res', content: '...', link: '...', pubDate: '', source: 'Sci' },
        ]
    }
];

describe('DigestView', () => {
    test('renders section headers and counts', () => {
        render(<DigestView sections={MOCK_SECTIONS} loading={false} onSelectArticle={vi.fn()} onGoToSettings={vi.fn()} />);

        expect(screen.getByText('Tech News')).toBeInTheDocument();
        expect(screen.getByText('Science')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Count for Tech
        expect(screen.getByText('1')).toBeInTheDocument(); // Count for Science
    });

    test('shows title peeks in collapsed state', () => {
        render(<DigestView sections={MOCK_SECTIONS} loading={false} onSelectArticle={vi.fn()} onGoToSettings={vi.fn()} />);

        const collapseBtn = screen.getByText('Collapse All');
        fireEvent.click(collapseBtn);

        // Tech News peek should show both titles joined by bullet
        expect(screen.getByText(/Apple Silicon Update • Nvidia GPU Launch/)).toBeInTheDocument();
    });

    test('toggles all sections with Collapse/Expand All', () => {
        render(<DigestView sections={MOCK_SECTIONS} loading={false} onSelectArticle={vi.fn()} onGoToSettings={vi.fn()} />);

        // Starts expanded (default)
        expect(screen.getByText('Apple Silicon Update')).toBeVisible();

        const toggleAll = screen.getByText('Collapse All');
        fireEvent.click(toggleAll);

        expect(screen.queryByText('Apple Silicon Update')).not.toBeInTheDocument();
        expect(screen.getByText('Expand All')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Expand All'));
        expect(screen.getByText('Apple Silicon Update')).toBeVisible();
    });

    test('toggles individual section expansion', () => {
        render(<DigestView sections={MOCK_SECTIONS} loading={false} onSelectArticle={vi.fn()} onGoToSettings={vi.fn()} />);

        const techHeader = screen.getByRole('button', { name: /Tech News/ });

        // Collapse Tech
        fireEvent.click(techHeader);
        expect(screen.queryByText('Apple Silicon Update')).not.toBeInTheDocument();

        // Expand Tech
        fireEvent.click(techHeader);
        expect(screen.getByText('Apple Silicon Update')).toBeVisible();
    });
});
