import { render, screen } from '@testing-library/react';
import ArticleCard from '@/components/articleCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    // Filter out next/image specific boolean props that cause warnings on raw <img>
    const { unoptimized, priority, ...rest } = props;
    return <img {...rest} alt={props.alt} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, as, ...rest }) => (
    <a href={as || href} {...rest}>
      {children}
    </a>
  ),
}));

describe('ArticleCard', () => {
  const mockArticle = {
    _id: '1',
    title: 'Test Article Title',
    category: 'Technology',
    description: '<p>Test description content</p>',
    createdAt: new Date().toISOString(),
    formattedDate: '2 hours ago',
    articleImage: ['http://example.com/image.png'],
    creator: {
      username: 'John Doe',
      avatar: 'http://example.com/avatar.png',
    },
  };

  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'http://example.com/image.png');
    expect(images[1]).toHaveAttribute('src', 'http://example.com/avatar.png');
  });

  it('displays a fallback image if articleImage is missing', () => {
    const articleWithoutImage = { ...mockArticle, articleImage: [] };
    render(<ArticleCard article={articleWithoutImage} />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('ik.imagekit.io'));
  });

  it('displays fallback creator name if creator is missing', () => {
    const articleWithoutCreator = { ...mockArticle, creator: null };
    render(<ArticleCard article={articleWithoutCreator} />);
    
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  it('generates correct slug for the link', () => {
    render(<ArticleCard article={mockArticle} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/article/Test-Article-Title');
  });

  it('handles titles with pipes in slug generation', () => {
    const articleWithPipe = { ...mockArticle, title: 'Test | Pipe' };
    render(<ArticleCard article={articleWithPipe} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/article/Test-%7C-Pipe');
  });
});
