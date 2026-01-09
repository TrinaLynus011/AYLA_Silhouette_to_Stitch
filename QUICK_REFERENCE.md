# AYLA - Quick Reference Guide

## 🚀 Start the App

```bash
npm run dev
```
Open: **http://localhost:3001**

## 📂 Project Structure

```
AYLA/
├── app/
│   ├── api/designs/          # MongoDB API routes
│   ├── page.tsx              # Main app page
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── components/
│   ├── DigitalTwin.tsx       # Body visualization
│   ├── OutfitCustomizer.tsx  # Design controls
│   ├── SavedDesigns.tsx      # Design gallery
│   └── ...                   # Other components
├── hooks/
│   └── useDesigns.ts         # Database operations
├── lib/
│   └── mongodb.ts            # Database connection
├── utils/
│   ├── digitalTwin.ts        # Twin math & rendering
│   ├── bodyTypeInference.ts  # Body analysis
│   ├── fabricEngine.ts       # Fabric logic
│   └── stylingEngine.ts      # Recommendations
├── types/
│   └── index.ts              # TypeScript types
└── .env.local                # Environment config
```

## 🔑 Key Components

### DigitalTwin.tsx
Real-time body visualization with adjustable sliders
```typescript
<DigitalTwin 
  bodyType={bodyType}
  outfitDesign={design}
  onCoordsUpdate={(coords) => {...}}
/>
```

### OutfitCustomizer.tsx
Design controls for outfit customization
```typescript
<OutfitCustomizer
  bodyType={bodyType}
  fabricType={fabric}
  onDesignComplete={(design, recs) => {...}}
/>
```

### SavedDesigns.tsx
Gallery of saved designs with load/delete
```typescript
<SavedDesigns 
  onLoadDesign={(design) => {...}}
/>
```

## 🗄️ Database Operations

### Save Design
```typescript
const { saveDesign } = useDesigns();
const id = await saveDesign(sessionData);
```

### Load All Designs
```typescript
const { loadAllDesigns } = useDesigns();
const designs = await loadAllDesigns();
```

### Load Specific Design
```typescript
const { loadDesign } = useDesigns();
const design = await loadDesign(id);
```

### Update Design
```typescript
const { updateDesign } = useDesigns();
await updateDesign(id, updates);
```

### Delete Design
```typescript
const { deleteDesign } = useDesigns();
await deleteDesign(id);
```

## 🎨 Body Types

- **Hourglass**: Balanced proportions, defined waist
- **Pear**: Fuller hips, narrower shoulders
- **Apple**: Broader shoulders, fuller midsection
- **Rectangle**: Similar measurements throughout

## 👗 Outfit Types

1. **Saree & Blouse**
   - Traditional drape
   - Blouse customization
   - Pallu styles

2. **Salwar Kameez**
   - Kameez cuts
   - Salwar styles
   - Dupatta drapes

3. **Lehenga Choli**
   - Choli designs
   - Lehenga flare
   - Dupatta options

4. **Anarkali Suit**
   - Flowing silhouette
   - Length variations
   - Embellishment options

## 🧵 Fabric Types

- Silk
- Cotton
- Chiffon
- Georgette
- Velvet
- Linen
- Satin
- Organza
- Brocade

## 🎯 API Endpoints

### POST /api/designs
Create new design
```bash
curl -X POST http://localhost:3001/api/designs \
  -H "Content-Type: application/json" \
  -d '{"body_type": {...}, "outfit_design": {...}}'
```

### GET /api/designs
Get all designs
```bash
curl http://localhost:3001/api/designs
```

### GET /api/designs/[id]
Get specific design
```bash
curl http://localhost:3001/api/designs/[id]
```

### PUT /api/designs/[id]
Update design
```bash
curl -X PUT http://localhost:3001/api/designs/[id] \
  -H "Content-Type: application/json" \
  -d '{"outfit_design": {...}}'
```

### DELETE /api/designs/[id]
Delete design
```bash
curl -X DELETE http://localhost:3001/api/designs/[id]
```

## 🔧 Environment Variables

```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/ayla
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Common Issues

### Port Already in Use
```bash
npx kill-port 3000
# or
npx kill-port 3001
```

### MongoDB Connection Error
1. Check MongoDB is running
2. Verify MONGODB_URI in .env.local
3. Restart dev server

### Build Errors
```bash
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
npm run build
# Check for type errors
```

## 📊 MongoDB Commands

### Connect
```bash
mongosh
```

### Use Database
```bash
use ayla
```

### View Designs
```bash
db.designs.find().pretty()
```

### Count Designs
```bash
db.designs.countDocuments()
```

### Delete All Designs
```bash
db.designs.deleteMany({})
```

### Find by Body Type
```bash
db.designs.find({"body_type.shape": "hourglass"})
```

## 🎨 Color Scheme

```css
Primary: #f97316 (Orange)
Secondary: #8b5cf6 (Purple)
Accent: #ec4899 (Pink)
Success: #10b981 (Green)
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
MONGODB_URI=your_atlas_connection_string
```

### Environment Setup
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to Vercel environment variables
4. Deploy

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `MONGODB_INTEGRATION.md` - Database details
- `CURRENT_STATUS.md` - Current state
- `QUICK_REFERENCE.md` - This file
- `DEPLOYMENT.md` - Deployment guide
- `QUICKSTART.md` - Feature guide

## 💡 Development Tips

### Hot Reload
Changes auto-reload in development mode

### Debug Mode
Open browser DevTools (F12)

### Component Inspector
Use React DevTools extension

### Database GUI
Use MongoDB Compass for visual management

### API Testing
Use Postman or Thunder Client

## 🎯 Feature Flags

Currently all features are enabled. To disable:

```typescript
// In app/page.tsx
const FEATURES = {
  savedDesigns: true,
  undertoneAnalysis: true,
  fabricUpload: true,
  aiSuggestions: false, // Coming soon
};
```

## 📞 Support

For issues:
1. Check documentation files
2. Review error messages
3. Check MongoDB connection
4. Verify environment variables
5. Clear .next cache

## ✨ Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Kill port
npx kill-port 3001

# Clear cache
rm -rf .next

# Install dependencies
npm install

# Update dependencies
npm update
```

---

**Happy Designing! 🧵✨**
