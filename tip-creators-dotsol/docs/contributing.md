# Contributing to SolCreator

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to SolCreator! This guide will help you get started with contributing to our decentralized tipping platform.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Solana CLI (for blockchain development)
- Expo CLI (for mobile development)

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/solcreator.git
cd solcreator/tip-creators-dotsol

# Add the original repository as upstream
git remote add upstream https://github.com/original-org/solcreator.git
```

### Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install Solana program dependencies
cd solcreator_program
npm install
cd ..
```

## 🔧 Development Setup

### Environment Configuration
```bash
# Copy environment files
cp backend/env.example backend/.env
cp .env.example .env

# Edit the files with your configuration
# See Installation Guide for details
```

### Start Development Servers
```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Mobile App
npm start
```

### Verify Setup
```bash
# Check if everything is working
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"...","version":"1.0.0"}
```

## 📝 Contribution Guidelines

### Types of Contributions

#### 🐛 Bug Fixes
- Fix bugs in existing functionality
- Improve error handling
- Add missing error messages
- Fix UI/UX issues

#### ✨ New Features
- Add new functionality
- Implement new UI components
- Add new API endpoints
- Integrate new social media platforms

#### 📚 Documentation
- Improve existing documentation
- Add code comments
- Create tutorials
- Update README files

#### 🧪 Testing
- Add unit tests
- Add integration tests
- Improve test coverage
- Add end-to-end tests

#### 🔧 Infrastructure
- Improve build process
- Add CI/CD pipelines
- Optimize performance
- Add monitoring

### Before You Start

1. **Check existing issues** - Your idea might already be discussed
2. **Create an issue first** - For significant changes, create an issue to discuss
3. **Check the roadmap** - Align with project goals
4. **Read the documentation** - Understand the current architecture

## 💻 Code Standards

### General Principles
- **Readability**: Write code that's easy to understand
- **Maintainability**: Code should be easy to modify and extend
- **Performance**: Consider performance implications
- **Security**: Follow security best practices
- **Accessibility**: Ensure accessibility compliance

### Frontend (React Native)

#### File Structure
```
components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── index.ts
├── feature-name/          # Feature-specific components
│   ├── component-name.tsx
│   └── index.ts
└── index.ts              # Main export file
```

#### Component Guidelines
```typescript
// Use TypeScript for all components
interface ComponentProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

// Use functional components with hooks
const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  onPress, 
  disabled = false 
}) => {
  // Component logic here
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// Export with proper typing
export default MyComponent;
```

#### Styling
```typescript
// Use StyleSheet for performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

// Use theme constants
import { UI_CONFIG } from '@/constants/ui-config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI_CONFIG.colors.background,
  },
});
```

### Backend (Node.js/Express)

#### File Structure
```
backend/
├── routes/               # API routes
│   ├── creators.js
│   ├── tips.js
│   └── social-media.js
├── middleware/           # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── rate-limit.js
├── services/            # Business logic
│   ├── creator-service.js
│   └── tip-service.js
└── utils/               # Utility functions
    ├── validation.js
    └── helpers.js
```

#### API Guidelines
```javascript
// Use async/await
const getCreators = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const creators = await creatorService.getCreators({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    
    res.json({
      creators: creators.data,
      pagination: creators.pagination,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// Use proper error handling
const createTip = async (req, res) => {
  try {
    const tip = await tipService.createTip(req.body);
    res.status(201).json(tip);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details,
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
```

### Smart Contracts (Rust/Anchor)

#### File Structure
```
solcreator_program/
├── programs/
│   └── solcreator_program/
│       └── src/
│           ├── lib.rs           # Main program file
│           ├── instructions/    # Program instructions
│           ├── state/           # Account structures
│           └── errors/          # Custom errors
├── tests/                       # Integration tests
└── migrations/                  # Database migrations
```

#### Rust Guidelines
```rust
// Use proper error handling
#[error_code]
pub enum SolCreatorError {
    #[msg("Invalid tip amount")]
    InvalidTipAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Creator not found")]
    CreatorNotFound,
}

// Use descriptive function names
pub fn record_tip(
    ctx: Context<RecordTip>,
    tip_amount: u64,
    reference: String,
) -> Result<()> {
    // Validate input
    require!(tip_amount > 0, SolCreatorError::InvalidTipAmount);
    
    // Business logic
    let user_state = &mut ctx.accounts.user_state;
    user_state.total_tips_sent += 1;
    
    // Emit event
    emit!(TipRecorded {
        user: ctx.accounts.user.key(),
        tip_amount,
        reference,
    });
    
    Ok(())
}

// Use proper account validation
#[derive(Accounts)]
pub struct RecordTip<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
        has_one = user
    )]
    pub user_state: Account<'info, UserState>,
    
    pub user: Signer<'info>,
}
```

## 🧪 Testing

### Frontend Testing
```typescript
// Unit tests for components
import { render, fireEvent } from '@testing-library/react-native';
import { CreatorCard } from '../components/creator-card';

describe('CreatorCard', () => {
  it('should render creator information', () => {
    const creator = {
      id: '1',
      name: 'John Doe',
      handle: '@johndoe',
    };
    
    const { getByText } = render(
      <CreatorCard creator={creator} onTip={jest.fn()} />
    );
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('@johndoe')).toBeTruthy();
  });
  
  it('should call onTip when tip button is pressed', () => {
    const onTip = jest.fn();
    const creator = { id: '1', name: 'John Doe' };
    
    const { getByText } = render(
      <CreatorCard creator={creator} onTip={onTip} />
    );
    
    fireEvent.press(getByText('Tip'));
    expect(onTip).toHaveBeenCalledWith('1');
  });
});
```

### Backend Testing
```javascript
// API endpoint tests
const request = require('supertest');
const app = require('../app');

describe('GET /api/creators', () => {
  it('should return creators list', async () => {
    const response = await request(app)
      .get('/api/creators')
      .expect(200);
    
    expect(response.body).toHaveProperty('creators');
    expect(response.body).toHaveProperty('pagination');
  });
  
  it('should handle pagination', async () => {
    const response = await request(app)
      .get('/api/creators?page=2&limit=5')
      .expect(200);
    
    expect(response.body.pagination.page).toBe(2);
    expect(response.body.pagination.limit).toBe(5);
  });
});
```

### Smart Contract Testing
```rust
// Integration tests
#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::solana_program::clock::Epoch;
    
    #[test]
    fn test_record_tip() {
        let program = start_program();
        let user = program.user();
        let creator = program.creator();
        
        // Initialize user state
        program
            .request()
            .accounts(InitializeUser {
                user: user.pubkey(),
                user_state: user_state_pda,
                system_program: system_program::ID,
            })
            .send()
            .unwrap();
        
        // Record tip
        let result = program
            .request()
            .accounts(RecordTip {
                user: user.pubkey(),
                user_state: user_state_pda,
                global_state: global_state_pda,
            })
            .args(record_tip::Args {
                tip_amount: 1000,
                reference: "test tip".to_string(),
            })
            .send();
        
        assert!(result.is_ok());
    }
}
```

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes
- Write your code following the standards above
- Add tests for new functionality
- Update documentation if needed
- Commit your changes with descriptive messages

### 3. Commit Guidelines
```bash
# Use conventional commit format
git commit -m "feat: add new tipping feature"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for creator service"
```

### 4. Push and Create PR
```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
# Fill out the PR template
```

### 5. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### 6. Code Review
- Address review comments
- Make requested changes
- Ensure all tests pass
- Update documentation if needed

## 🐛 Issue Reporting

### Bug Reports
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. iOS 15, Android 12]
- App Version: [e.g. 1.0.0]
- Device: [e.g. iPhone 13, Samsung Galaxy]

## Additional Context
Screenshots, logs, etc.
```

### Feature Requests
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you considered

## Additional Context
Any other relevant information
```

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Follow project guidelines
- Be patient with newcomers

### Communication
- **GitHub Issues**: For bugs and feature requests
- **Discord**: For discussions and questions
- **Pull Requests**: For code contributions
- **Documentation**: For improvements and clarifications

### Recognition
- Contributors will be listed in the README
- Significant contributions will be highlighted
- Regular contributors may be invited to join the team

## 🎯 Getting Help

### Before Asking
1. **Search existing issues** - Your question might already be answered
2. **Read the documentation** - Check the docs folder
3. **Try debugging** - Use the debugging tools mentioned in the docs

### When Asking
1. **Be specific** - Provide clear details about your issue
2. **Include context** - Share relevant code and error messages
3. **Show effort** - Explain what you've already tried
4. **Be patient** - Community members are volunteers

## 🚀 Advanced Contributing

### Architecture Decisions
- Major architectural changes require discussion
- Create an Architecture Decision Record (ADR)
- Consider impact on existing functionality
- Plan for backward compatibility

### Performance Contributions
- Profile before optimizing
- Measure impact of changes
- Consider trade-offs
- Document performance improvements

### Security Contributions
- Follow security best practices
- Report security issues privately
- Test security changes thoroughly
- Document security considerations

## 📚 Resources

### Documentation
- [Project Overview](./project-overview.md)
- [Installation Guide](./installation-guide.md)
- [API Reference](./api/backend-api.md)
- [Frontend Guide](./development/frontend-guide.md)

### External Resources
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Solana Docs](https://docs.solana.com/)
- [Anchor Docs](https://www.anchor-lang.com/)

### Community
- [Discord](https://discord.gg/solcreator)
- [GitHub Discussions](https://github.com/your-org/solcreator/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/solcreator)

---

Thank you for contributing to SolCreator! Your contributions help make the platform better for creators and supporters around the world. 🌟
