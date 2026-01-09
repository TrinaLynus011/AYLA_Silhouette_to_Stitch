# AYLA Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string

### 3. Configure Environment
Create `.env.local` file in the root directory:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/ayla

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayla?retryWrites=true&w=majority

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Features Currently Working

✅ Body type input (image upload & manual selection)
✅ Digital twin visualization with real-time adjustments
✅ Fabric selection
✅ Outfit customization (Saree, Salwar, Lehenga, Anarkali)
✅ Design recommendations
✅ Export to PDF/Image/WhatsApp
✅ Save designs to MongoDB
✅ Load saved designs

## Next Steps

### Phase 1: Core Enhancements
- [ ] Add drag-and-drop design canvas
- [ ] Implement component library (necklines, sleeves, borders)
- [ ] Add undo/redo functionality
- [ ] Improve digital twin rendering

### Phase 2: AI Integration
- [ ] Fabric pattern recognition (image upload)
- [ ] AI-assisted design suggestions
- [ ] Color matching based on undertone

### Phase 3: Advanced Features
- [ ] User authentication
- [ ] Design sharing via links
- [ ] Inspiration board
- [ ] Tailor collaboration features

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access (for Atlas)

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Database**: MongoDB
- **Export**: jsPDF, html2canvas
- **Deployment**: Vercel (recommended)

## Support

For issues or questions, check:
- README.md for project overview
- DEPLOYMENT.md for deployment guide
- QUICKSTART.md for feature details
