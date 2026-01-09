# Ayla

**From Silhouette to Stitch, Designed on You**

AI-Powered Indian Women Styling & Tailoring Assistant - Production-grade MVP

## 🎯 Product Vision

Ayla is a comprehensive styling platform that helps Indian women design their perfect ethnic wear outfit. From analyzing your unique silhouette to generating tailor-ready specifications, Ayla makes custom Indian outfit design accessible, personal, and culturally sensitive.

### What Ayla Does

- **Analyzes your silhouette** using camera-based body type detection or manual selection
- **Understands your skin undertone** for perfect color recommendations
- **Offers complete Indian outfit types**: Saree & Blouse, Salwar Kameez, Lehenga Choli, Anarkali, Sharara, and more
- **Provides visual design preview** on your digital twin with captured photo overlay
- **Generates detailed measurements** for professional tailoring
- **Creates tailor-ready exports** with comprehensive specifications
- **Respects your privacy** with local processing and no data storage

## 🏗️ Architecture

### Frontend (PWA / Mobile-first)
- **Image Capture & Pose Guidance** (Default)
- **Manual Body Shape Selector** (Optional)
- **Fabric Selection Module**
- **Digital Twin Renderer** (SVG / Canvas)
- **Outfit & Blouse Customization Engine**
- **Recommendation Explanation Panel**
- **Export to Tailor Module**

### Backend (API Layer)
- **Body Type Inference Service**
- **Rule-Based Styling Engine**
- **Fabric Compatibility Engine**
- **Session & User Preference Manager**

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Digital Twin**: SVG + HTML Canvas
- **PWA**: Next.js PWA support
- **Storage**: Local storage (session-based)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🌟 Key Features

### 📸 Silhouette Analysis
- **Camera-based detection** with JPEG validation and quality checks
- **Manual body shape selection** with visual guides
- **Live photo overlay** on digital twin showing your actual silhouette
- **Adjustable proportions** with real-time preview

### 🎨 Undertone & Color Matching
- **AI-powered skin undertone detection** from your photo
- **Manual undertone selection** with detailed guidance
- **Personalized color palettes** based on warm/cool/neutral undertones
- **Custom color picker** with undertone compatibility warnings

### 👗 Complete Outfit Design
- **8 Indian outfit types**: Saree & Blouse, Salwar Kameez, Lehenga Choli, Anarkali Suit, Sharara, Kurti Palazzo, Half Saree, Indo-Western
- **Comprehensive customization**: Necklines, sleeves, lengths, fits, draping styles
- **Saree-specific options**: Pleating patterns, pallu styles, draping methods
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