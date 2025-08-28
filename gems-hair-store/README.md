# Gems Hair Store - E-commerce Platform

A modern, responsive e-commerce website built with Next.js, React, TypeScript, Tailwind CSS, and Shadcn/ui for hair care products.

## 🚀 Features

- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **Component Library**: Built with Shadcn/ui components
- **TypeScript**: Full type safety and better development experience
- **Responsive**: Mobile-first design that works on all devices
- **E-commerce Ready**: Product listings, categories, search, and filtering
- **Performance**: Optimized with Next.js 15

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Form Handling**: React Hook Form (ready to implement)

## 📁 Project Structure

```
gems-hair-store/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── products/          # Products page
│       └── page.tsx
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Site footer
├── lib/                  # Utility functions
│   └── utils.ts          # Shadcn utilities
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gems-hair-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

### Homepage (`/`)
- Hero section with call-to-action
- Featured product categories
- Product showcase
- Newsletter subscription

### Products (`/products`)
- Product grid with filtering
- Search functionality
- Category selection
- Sorting options
- Pagination

## 🎨 Components

### Header
- Responsive navigation
- Search bar
- Shopping cart
- User menu
- Mobile hamburger menu

### Footer
- Company information
- Quick links
- Customer service
- Newsletter signup
- Social media links

### Product Cards
- Product images
- Pricing information
- Ratings and reviews
- Add to cart functionality
- Stock status indicators

## 🔧 Customization

### Adding New Products
Edit the `products` array in `app/products/page.tsx`:

```typescript
const products = [
  {
    id: 9,
    name: "New Product",
    description: "Product description",
    price: 25.99,
    category: "Hair Care",
    rating: 4.5,
    reviews: 50,
    inStock: true,
    isNew: false
  }
]
```

### Styling
- Colors: Update CSS variables in `app/globals.css`
- Layout: Modify Tailwind classes in components
- Theme: Change base color in `components.json`

### Adding New Pages
1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Update navigation in `components/Header.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- Docker deployment

## 📈 Future Enhancements

- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Product reviews system
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Order tracking
- [ ] Email notifications
- [ ] Analytics integration
- [ ] SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: info@gemshair.com

---

Built with ❤️ using Next.js, React, and Tailwind CSS
