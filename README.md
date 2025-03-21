# Hex Color Accessibility Checker

A tool to check color combinations against WCAG accessibility standards and get suggestions for accessible alternatives.

## Features

- Check contrast ratio between foreground and background colors
- Validate against WCAG 2.1 compliance levels (AA and AAA for both large and small text)
- Generate accessible color alternatives when combinations don't meet standards
- Preview color combinations in real-time
- Generate random colors for testing

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite (for build and development)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd colour-accessibility-checker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

To run the project in development mode:

```bash
pnpm dev
```

This will start a development server at http://localhost:3000

### Build

To build the project for production:

```bash
pnpm build
```

The production files will be output to the `dist` directory.

### Preview

To preview the production build:

```bash
pnpm preview
```

## How to Use

1. Enter your foreground (text) color and background color in hex format (e.g., #000000 for black)
2. Click "Check Accessibility" to see the contrast ratio and WCAG compliance results
3. If the combination doesn't meet standards, review the suggested alternatives
4. Click "Apply" on any alternative to use that color combination
5. Use "Random Colors" to generate random combinations for testing
6. Click "Reset" to return to the default black on white combination

## License

ISC 