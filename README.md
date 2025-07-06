# Personal Finance Visualizer

A comprehensive web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features

### Stage 3 (Complete Implementation):
- ✅ **Transaction Management**: Add, edit, delete transactions with validation
- ✅ **Categories**: Predefined categories with icons and colors
- ✅ **Dashboard**: Summary cards, recent transactions, charts
- ✅ **Analytics**: Monthly trends, category breakdown, spending insights
- ✅ **Budgeting**: Set monthly budgets, track vs actual spending
- ✅ **Charts**: Bar charts, pie charts, area charts for data visualization
- ✅ **Responsive Design**: Mobile-friendly with sidebar navigation
- ✅ **Animations**: Smooth transitions and effects with Framer Motion

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Charts**: Recharts
- **Database**: MongoDB
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd finance-visualizer
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### MongoDB Setup

1. **Create a MongoDB Atlas account** at [mongodb.com](https://www.mongodb.com/atlas)
2. **Create a new cluster**
3. **Create a database user** with read/write permissions
4. **Get your connection string** and replace the placeholder in `.env.local`
5. **Whitelist your IP address** in Network Access

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── transactions/      # Transaction management page
│   ├── analytics/         # Analytics page
│   ├── budgets/          # Budget management page
│   └── page.tsx          # Dashboard
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── transactions/     # Transaction components
│   └── budgets/          # Budget components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Key Features Explained

### Dashboard
- Summary cards showing total balance, income, expenses
- Monthly expense trends chart
- Category breakdown pie chart
- Recent transactions list

### Transactions
- Add/edit/delete transactions
- Category selection with icons
- Search and filter functionality
- Sort by date or amount
- Form validation

### Analytics
- Monthly income vs expenses area chart
- Category distribution pie chart
- Weekly spending patterns
- Key insights and savings rate

### Budgets
- Set monthly budgets by category
- Visual progress bars
- Budget vs actual comparison chart
- Over-budget alerts
- Monthly/yearly budget management

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**:
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in Vercel dashboard
- Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Transactions
![Transactions](screenshots/transactions.png)

### Analytics
![Analytics](screenshots/analytics.png)

### Budgets
![Budgets](screenshots/budgets.png)

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
