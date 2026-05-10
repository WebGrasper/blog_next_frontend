import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/ConfirmModal';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
  AlertTriangle: () => <div data-testid="alert-icon" />,
}));

describe('ConfirmModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with default props when open', () => {
    render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
    fireEvent.click(screen.getByText('Yes, Delete'));
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button or close button is clicked', () => {
    const { rerender } = render(
      <ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    
    fireEvent.click(screen.getByText('No, Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('x-icon'));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('closes when clicking on the overlay', () => {
    const { container } = render(
      <ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />
    );
    
    // The first div is the overlay
    fireEvent.click(container.firstChild);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking on the modal content', () => {
    render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
    const content = screen.getByText('Are you sure?').parentElement.parentElement;
    fireEvent.click(content);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
