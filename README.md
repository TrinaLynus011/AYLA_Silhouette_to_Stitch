# 🌸 AYLA - AI-Powered Indian Fashion Styling Platform

> **From Silhouette to Stitch, Designed on You**

AYLA is an intelligent styling and tailoring assistant for Indian ethnic wear that combines body analysis, undertone detection, fabric intelligence, and personalized design recommendations to create custom outfit specifications ready for production.

---

## ✨ Features

### 🎯 Core Capabilities

- **Body Type Detection** - AI-powered analysis of body proportions and shape classification (Pear, Apple, Hourglass, Rectangle)
- **Undertone Analysis** - Skin undertone detection for personalized color recommendations (Warm/Cool/Neutral)
- **Smart Fabric Engine** - Fabric compatibility analysis across 9+ fabric types (Silk, Cotton, Chiffon, etc.)
- **Digital Twin Visualization** - Real-time SVG-based body silhouette with outfit overlay
- **Intelligent Styling Engine** - Context-aware recommendations based on body type, fabric, and undertone
- **Interactive Outfit Customization** - Manual override with expert rationale for every design choice
- **Tailor-Ready Tech Pack** - Professional specification sheets with measurements and construction notes

### 🎨 Personalization Features

- **Dynamic Accessories Suggestions** - Body-shape and undertone-specific jewelry recommendations (Choker, Rani Haar, Kamarbandh, Jhumkas)
- **Fabric-Aware Avoidance Lists** - Context-sensitive warnings for fabric-body combinations
- **Detailed Tailor Notes** - Fabric-specific construction instructions with seam allowances and needle specifications
- **Makeup Recommendations** - Undertone-matched beauty suggestions
- **Live Rationale Updates** - Real-time expert explanations as you adjust body proportions and design elements
- **Fabric Care Instructions** - Professional washing, drying, and storage guidelines

### 📦 Outfit Types Supported

- **Saree & Blouse** - Traditional draped saree with fitted blouse
- **Salwar Kameez** - Tunic with loose pants and dupatta
- **Lehenga Choli** - Flared skirt with fitted top
- **Anarkali Suit** - Flowing long dress with fitted bodice

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (for design persistence)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AYLA

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your MongoDB connection string to MONGODB_URI

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
AYLA/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── designs/          # Design CRUD endpoints
│   ├── demo/                 # Demo flow page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── BodyShapeIndicator.tsx
│   ├── DigitalTwin.tsx       # SVG body visualization
│   ├── FabricSelector.tsx
│   ├── ImageCapture.tsx      # Body photo upload
│   ├── ManualBodySelector.tsx
│   ├── MeasurementsInput.tsx
│   ├── OutfitCustomizer.tsx  # Main design interface
│   ├── RecommendationPanel.tsx
│   ├── SavedDesigns.tsx
│   ├── TailorTechPack.tsx    # Professional spec sheet
│   ├── UndertoneAnalysis.tsx
│   └── ...
├── utils/                    # Core logic engines
│   ├── bodyTypeInference.ts  # Body shape classification
│   ├── digitalTwin.ts        # SVG coordinate generation
│   ├── fabricEngine.ts       # Fabric property system
│   ├── smartDesignEngine.ts  # AI design generation
│   ├── stylingEngine.ts      # Recommendation engine
│   ├── undertoneEngine.ts    # Skin tone analysis
│   └── undertoneFromImage.ts # Image-based undertone
├── lib/                      # Utilities
│   ├── changeIsolation.ts    # State management
│   ├── mongodb.ts            # Database connection
│   └── persistentBody.ts     # Body data persistence
├── types/                    # TypeScript definitions
│   └── index.ts
└── public/                   # Static assets
```

---

## 🎯 User Flow

1. **Body Analysis**
   - Upload photo or manual input measurements
   - AI detects body shape (Pear, Apple, Hourglass, Rectangle)
   - System infers proportions and ratios

2. **Undertone Detection**
   - Optional skin undertone analysis (Warm/Cool/Neutral)
   - Generates personalized color palette

3. **Fabric Selection**
   - Choose from 9+ fabric types
   - System analyzes drape, structure, and compatibility

4. **Outfit Design**
   - Select outfit type (Saree, Salwar, Lehenga, etc.)
   - AI generates body-appropriate base design
   - Customize neckline, sleeves, fit, colors

5. **Recommendation Review**
   - View expert rationale for design choices
   - See accessories, makeup, and avoidance lists
   - Read tailor notes and fabric care instructions

6. **Export for Tailor**
   - Generate professional tech pack
   - Export as PDF with measurements
   - Save design for future reference

---

## 🧠 Technical Architecture

### Frontend
- **Framework**: Next.js 14 (React 18, App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks + Change Isolation System

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Storage**: MongoDB GridFS (for images)

### AI/ML Features
- Body shape classification algorithm
- Undertone detection from skin pixels
- Fabric compatibility matrix
- Context-aware recommendation engine

### Key Technologies
- TypeScript for type safety
- SVG for scalable graphics
- Canvas API for image processing
- PDF generation (jsPDF)

---

## 🎨 Styling Engine Logic

### Body-Specific Recommendations

**Pear Shape**
- Neckline: Boat neck (broadens shoulders)
- Accessories: Heavy choker, minimal waist pieces
- Avoidance: Hip embroidery, horizontal patterns

**Apple Shape**
- Neckline: V-neck (elongates torso)
- Accessories: Rani haars, small studs
- Avoidance: High necks, bulky layers

**Hourglass Shape**
- Neckline: Sweetheart (accentuates curves)
- Accessories: Kamarbandh waist belt, balanced jhumkas
- Avoidance: Loose fits that hide curves

**Rectangle Shape**
- Neckline: Round or embellished
- Accessories: Layered necklaces, wide bangles
- Avoidance: Simple, linear silhouettes

### Fabric Intelligence

**Silk/Chiffon**
- Fine-gauge needles to prevent snagging
- Reinforced neckline piping
- Avoid dark high-contrast prints (silk)

**Cotton**
- Pre-wash for shrinkage
- Standard needles and thread
- Durable for frequent wear

**Brocade/Velvet**
- Pattern matching at seams
- Wider seam allowances
- Avoid extreme tailoring

---

## 🔧 Configuration

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/ayla
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Customization

- **Fabric Types**: Extend in `types/index.ts` → `FabricType`
- **Body Shapes**: Modify logic in `utils/bodyTypeInference.ts`
- **Design Rules**: Update `utils/stylingEngine.ts` methods
- **Color Palette**: Configure in `utils/undertoneEngine.ts`

---

## 📊 Database Schema

### Design Collection

```typescript
{
  _id: ObjectId,
  user_id: string,
  body_type: {
    shape: string,
    ratios: { shoulder_ratio, waist_ratio, hip_ratio }
  },
  outfit: {
    outfit_type: string,
    top_design: { neckline, sleeve_length, fit, ... },
    color_scheme: { primary_color, undertone_match }
  },
  fabric_type: string,
  recommendation: {
    reasoning: string,
    accessories: string[],
    avoid: string[],
    tailor_notes: string[]
  },
  created_at: Date,
  updated_at: Date
}
```

---

## 🏗️ Architecture

### Frontend Components
- **Image Capture & Pose Guidance** - Photo upload with quality validation
- **Manual Body Shape Selector** - Alternative input method
- **Fabric Selection Module** - 9+ fabric types with property analysis
- **Digital Twin Renderer** - SVG-based body visualization
- **Outfit Customization Engine** - Interactive design controls
- **Recommendation Panel** - Expert rationale display
- **Export Module** - Professional tailor tech pack generation

### Backend Services
- **Body Type Inference Service** - Shape classification algorithm
- **Rule-Based Styling Engine** - Context-aware recommendations
- **Fabric Compatibility Engine** - Property-based analysis
- **MongoDB API Layer** - Design persistence and retrieval

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

---

## 📝 API Endpoints

### Designs API

- **GET** `/api/designs` - Retrieve all saved designs
- **POST** `/api/designs` - Save new design
- **GET** `/api/designs/[id]` - Get specific design
- **PUT** `/api/designs/[id]` - Update design
- **DELETE** `/api/designs/[id]` - Delete design

---

## 🛣️ Roadmap

### Current Version (v1.0)
- ✅ Body type detection
- ✅ Undertone analysis
- ✅ Fabric intelligence
- ✅ Context-aware styling recommendations
- ✅ Interactive outfit customization
- ✅ Tailor tech pack export
- ✅ MongoDB persistence

### Planned Features (v2.0)
- [ ] 3D avatar with cloth physics simulation
- [ ] Real-time fabric photo upload and texture analysis
- [ ] Drag-and-drop modular garment builder
- [ ] 360° virtual try-on with fit sliders
- [ ] Enhanced AR visualization
- [ ] Multi-language support (Hindi, Tamil, Bengali, etc.)
- [ ] Social sharing and community designs
- [ ] Direct tailor marketplace integration
- [ ] Pattern generation system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

**AYLA** - AI-Powered Fashion Technology for the Modern Indian Woman

For questions or support, please contact the development team.

---

## 🙏 Acknowledgments

- Indian fashion design principles and terminology
- Traditional tailoring practices and standards
- Body proportion research and classification systems
- Fabric science and garment construction methodology

---

**Made with ❤️ for the Indian fashion industry**
- **Manual design slot** for complete creative freedom

### 🧵 Fabric Intelligence
- **9 traditional fabrics** + custom option
- **Fabric properties engine** affecting design recommendations
- **Compatibility warnings** for fabric-design combinations
- **Occasion-based filtering** (Daily, Festive, Bridal)

### 🤖 AI Styling Engine
- **Body type + fabric + color analysis** for optimal recommendations
- **Explainable AI** with reasoning for every suggestion
- **Accessory recommendations** specific to outfit type
- **Makeup guidance** based on occasion and colors
- **Things to avoid** personalized to your body type

### 📐 Detailed Measurements
- **Comprehensive measurement chart**: Bust, waist, hip, shoulder, arm length, and more
- **Outfit-specific measurements**: Saree blouse length, lehenga skirt length, dupatta length
- **Front, side, and back specifications**
- **Professional tailoring standards**

### 📤 Tailor-Ready Exports
- **PDF documents** with complete specifications
- **Design sketches** with visual annotations
- **WhatsApp sharing** for instant tailor communication
- **Measurement charts** in standard tailoring format
- **Fabric handling notes** specific to your material
- **Construction guidelines** for complex designs

## 🔐 Privacy & Safety

- **Privacy-first**: Images processed locally, deleted immediately
- **No biometric claims**: Visual guidance only
- **No measurement claims**: Approximate visual model
- **Clear disclaimers**: Final fit depends on tailoring
- **Cultural sensitivity**: Respectful language and recommendations

## 🎨 Design Principles

1. **Image-based input is DEFAULT**
2. **Manual body selection is OPTIONAL**
3. **Fabric is INPUTTED, not simulated**
4. **Visual guidance > numerical precision**
5. **User override always wins**
6. **Privacy-first, trust-first**
7. **Indian cultural sensitivity**
8. **Fast demo (< 2 minutes to output)**

## 📊 Success Metrics

- First output < 2 minutes
- User confidence increase
- No demo crashes
- Clear value without explanation

## 🚫 Out of Scope

- Fabric physics simulation
- AR try-on experiences
- Exact measurements
- Automated tailoring
- E-commerce checkout
- Face analysis or biometric data

## 🔮 Future Enhancements

- Tailor subscription services
- Designer marketplace integration
- Regional style packs
- Advanced fabric simulation
- Social sharing features
- Inspiration board expansion

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@indianstylingassistant.com or create an issue in this repository.

---

**Built with ❤️ for Indian women who want to look and feel their best in traditional wear.**

**Ayla - From Silhouette to Stitch, Designed on You**