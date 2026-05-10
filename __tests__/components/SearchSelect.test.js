import { render, screen, fireEvent } from '@testing-library/react';
import SearchSelect from '@/components/SearchSelect';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  ChevronDown: () => <div data-testid="chevron-icon" />,
  Check: () => <div data-testid="check-icon" />,
}));

describe('SearchSelect', () => {
  const mockOptions = ['National', 'World', 'Politics', 'Sports'];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with placeholder when no value is provided', () => {
    render(<SearchSelect options={mockOptions} value="" onChange={mockOnChange} />);
    expect(screen.getByText('Select category')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<SearchSelect options={mockOptions} value="" onChange={mockOnChange} />);
    
    const trigger = screen.getByText('Select category');
    fireEvent.click(trigger);
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    mockOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('filters options based on search input', () => {
    render(<SearchSelect options={mockOptions} value="" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('Select category'));
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'World' } });
    
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.queryByText('Politics')).not.toBeInTheDocument();
  });

  it('calls onChange and closes dropdown when an option is selected', () => {
    render(<SearchSelect options={mockOptions} value="" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('Select category'));
    const option = screen.getByText('Politics');
    fireEvent.click(option);
    
    expect(mockOnChange).toHaveBeenCalledWith('Politics');
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('displays "No results found" when search matches nothing', () => {
    render(<SearchSelect options={mockOptions} value="" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('Select category'));
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'NonExistent' } });
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
