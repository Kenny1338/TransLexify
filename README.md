# TransLexify 🌍

A modern AI-powered translation tool that enables precise and context-aware translations across multiple languages.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Kenny1338/TransLexify)

## 📸 Screenshots

Here's a visual overview of TransLexify in action:

![TransLexify Screenshot 1](screenshots/pic1.png)
*Main translation interface*

![TransLexify Screenshot 2](screenshots/pic2.png)
*Advanced translation features*

## 🚀 Features

- 🤖 AI-powered translations using OpenAI
- 🌐 Support for multiple languages
- ✨ Modern, user-friendly interface
- 🎯 Context-aware translations
- ⚡ Real-time translation
- 📱 Responsive design

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Bundler**: Vite
- **Language**: TypeScript
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **State Management**: React Query

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenAI API Key

## 🚀 Installation

1. Clone the repository:
```bash
git clone git@github.com:Kenny1338/TransLexify.git
cd TransLexify
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## 📦 Build

For a production build:
```bash
npm run build
```

For a development build:
```bash
npm run build:dev
```

## 🧪 Linting

Check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
TransLexify/
├── src/
│   ├── components/     # UI Components
│   ├── hooks/         # Custom React Hooks
│   ├── services/      # API Services
│   ├── styles/        # Global Styles
│   ├── types/         # TypeScript Definitions
│   └── utils/         # Helper Functions
├── public/            # Static Assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI](https://openai.com/)