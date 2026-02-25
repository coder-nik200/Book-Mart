# Contributing to BookMart

Thank you for your interest in contributing to BookMart! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge
Be respectful, inclusive, and professional. Treat all community members with dignity.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing opinions
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment of any kind
- Discriminatory language or actions
- Personal attacks
- Trolling or non-constructive criticism
- Any form of disrespect

---

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB
- Git
- Basic knowledge of React and Node.js
- Familiarity with REST APIs

### Fork & Clone
1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/BookMart.git
cd BookMart
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/BookMart.git
```

### Setup Development Environment
```bash
# Backend setup
cd Backend
npm install
cp .env.example .env
npm run seed

# Frontend setup
cd ../Frontend
npm install
npm run dev
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

---

## Development Process

### Before Starting
1. Check existing issues to avoid duplication
2. Create an issue for your feature/bug fix
3. Get feedback on the approach
4. Create a branch from the issue

### Working on Features

#### Naming Conventions
- **Branch**: `feature/feature-name` or `fix/bug-name`
- **Components**: PascalCase (e.g., `BookCard.jsx`)
- **Functions**: camelCase (e.g., `getBooks()`)
- **Variables**: camelCase (e.g., `totalPrice`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)

#### Backend Development
1. Create model if needed
2. Create controller with business logic
3. Create routes
4. Register routes in server.js
5. Add tests

#### Frontend Development
1. Create component with TypeScript types
2. Add necessary CSS/Tailwind classes
3. Connect to API
4. Add error handling
5. Add tests

### Testing Your Changes
```bash
# Backend
cd Backend
npm test

# Frontend
cd Frontend
npm test
```

### Manual Testing Checklist
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Error cases handled
- [ ] Loading states implemented
- [ ] Accessibility maintained

---

## Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build/dependency updates

### Subject
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Body (Optional)
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer
- Reference issues: `Closes #123`
- Reference PRs: `Related to #456`

### Examples

**Good:**
```
feat: add wishlist functionality

Add ability for users to save books to wishlist.
Wishlist data persists in localStorage and syncs
with backend.

Closes #42
```

**Bad:**
```
Updated wishlist
Fixed bugs
```

### Commit Frequently
```bash
git add .
git commit -m "feat: add wishlist button to book card"

# Make another change
git add .
git commit -m "test: add wishlist tests"
```

---

## Pull Request Process

### Before Submitting
1. Update from upstream:
```bash
git fetch upstream
git rebase upstream/main
```

2. Run tests:
```bash
npm test
```

3. Build frontend:
```bash
cd Frontend
npm run build
```

4. Check for linting errors:
```bash
npm run lint
```

### Create PR
1. Push to your fork:
```bash
git push origin feature/your-feature-name
```

2. Create PR on GitHub with:
   - Clear title describing changes
   - Description of what was changed and why
   - Screenshots if UI changes
   - Related issues (closes #123)

### PR Description Template
```markdown
## Description
Briefly describe your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe testing approach

## Checklist
- [ ] My code follows style guidelines
- [ ] I have updated documentation
- [ ] I have added tests
- [ ] Existing tests pass
- [ ] No new warnings generated
```

### Review Process
1. Maintainers will review your PR
2. Make requested changes
3. Push updates to same branch
4. PR will be merged once approved

### CI/CD Checks
Your PR must pass:
- Linting checks
- Unit tests
- Build tests
- Code coverage (if applicable)

---

## Code Style

### JavaScript/React

#### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at end of statements
- Max line length: 100 characters

#### Naming
```javascript
// Good
const getUserById = (id) => { ... }
const isValidEmail = true
const MAX_RETRIES = 3

// Bad
const getuserid = (id) => { ... }
const valid = true
const MAX_RETRIES_VALUE = 3
```

#### Components
```javascript
// Good - Functional component
export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="book-card">
      {/* content */}
    </div>
  );
}

// Good - With props validation
BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

// Avoid - Class components (unless necessary)
```

#### Using Hooks
```javascript
// Good
const [books, setBooks] = useState([]);

useEffect(() => {
  fetchBooks();
}, []);

// Avoid
useEffect(() => {
  // missing dependency array
});
```

### MongoDB/Mongoose

#### Schema Definition
```javascript
// Good - Clear schema with validation
const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
});

// Add indexes for frequently queried fields
bookSchema.index({ categoryId: 1 });
```

### Comments
```javascript
// Good
// Calculate total with tax
const totalWithTax = subtotal * (1 + TAX_RATE);

// Avoid
// Add tax
const x = y * z;

// Good - Document complex logic
/**
 * Calculates final price with discount and tax
 * @param {number} basePrice - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} Final price
 */
const calculatePrice = (basePrice, discount) => {
  // implementation
};
```

### Error Handling
```javascript
// Good - Specific error handling
try {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
} catch (error) {
  if (error.kind === 'ObjectId') {
    throw new AppError('Invalid ID format', 400);
  }
  throw error;
}

// Avoid - Generic catch
try {
  // code
} catch (error) {
  console.log('An error occurred');
}
```

### CSS/Tailwind
```jsx
// Good
<div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
  <span className="font-semibold text-gray-900">{title}</span>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>

// Avoid - Inline styles
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
```

---

## Testing

### Writing Tests

#### Backend Tests
```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/signup - should create new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('john@example.com');
  });
});
```

#### Frontend Tests
```javascript
// src/__tests__/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from '../components/BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    _id: '1',
    title: 'Test Book',
    author: 'Test Author',
    price: 100,
  };

  test('renders book information', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  test('calls onAddToCart when button clicked', async () => {
    const mockAddToCart = jest.fn();
    render(<BookCard book={mockBook} onAddToCart={mockAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockBook);
  });
});
```

### Test Coverage
- Aim for >80% coverage for critical paths
- Test happy path and error cases
- Test edge cases
- Test user interactions

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test BookCard.test.js
```

---

## Documentation

### README.md
- Clear project description
- Installation instructions
- Usage examples
- API overview
- Contributing guidelines
- License info

### Code Comments
- Explain why, not what
- Document complex logic
- Add JSDoc for functions
- Keep comments updated

### API Documentation
- Document all endpoints
- Include request/response examples
- List query parameters
- Document error cases
- Include auth requirements

### File Organization
```
// Good - Clear structure
Backend/
├── src/
│   ├── models/        # Data models
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Middleware
│   ├── utils/         # Helper functions
│   └── __tests__/     # Tests
```

---

## Review Process Tips

### For Reviewers
- Be constructive and respectful
- Ask questions instead of making demands
- Acknowledge good work
- Suggest improvements with examples
- Test the changes locally

### For Contributors
- Be open to feedback
- Ask clarifying questions
- Respond promptly
- Make requested changes promptly
- Thank reviewers for their time

---

## Common Issues

### Merge Conflicts
```bash
# Update from upstream
git fetch upstream
git rebase upstream/main

# Resolve conflicts in files
# Then continue
git add .
git rebase --continue
git push -f origin feature/branch-name
```

### Large PR
- Keep PRs focused and small
- Break large changes into multiple PRs
- Describe relationships between PRs
- Request reviews progressively

### Test Failures
- Run tests locally before pushing
- Check CI/CD logs for details
- Fix test issues in separate commit
- Don't skip or disable tests

---

## Resources

- [Git Handbook](https://guides.github.com/)
- [Jest Testing](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

## Reporting Issues

### Issue Template
```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: Windows/Mac/Linux
- Node.js version: v18.0.0
- npm version: 9.0.0
```

### Security Issues
- Do NOT open public issue
- Email security contact privately
- Include reproduction steps
- Allow time for fix before disclosure

---

## Community

### Getting Help
- Search existing GitHub issues
- Check documentation
- Ask in GitHub Discussions
- Contact maintainers

### Recognition
Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

## License

By contributing to BookMart, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Your contributions, large or small, help make BookMart better for everyone. We appreciate your dedication and support!

---

**Last Updated**: 2024
**Status**: Active ✅
