# Ayla - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

---

## 🎯 Test the Complete Flow

### Step 1: Welcome Screen
- See the Ayla branding and tagline
- Click "Start Your Styling Journey"

### Step 2: Silhouette Analysis
**Option A - Camera/Upload (Recommended)**
1. Click "Use Camera" or "Upload Photo"
2. Take/select a front-facing photo
3. Image will be validated automatically
4. If validation fails, you'll get clear feedback
5. Once validated, your digital twin is created

**Option B - Manual Selection**
1. Switch to "Manual Selection" tab
2. Choose your body shape (Hourglass, Pear, Apple, Rectangle)
3. Review characteristics and select

### Step 3: Fabric Selection
1. Browse traditional Indian fabrics
2. Use occasion filters (Daily, Festive, Bridal)
3. Select your fabric or choose "Custom"
4. Read fabric tips
5. Click "Continue to Design"

### Step 4: Undertone Analysis (Optional)
**If you uploaded a photo:**
1. Click "Analyze My Undertone" for AI detection
2. OR switch to "Manual Selection"
3. OR click "Skip this step"

**Manual Selection:**
1. Choose Warm, Cool, or Neutral
2. Review characteristics and recommended colors
3. Click "Continue"

### Step 5: Design Your Outfit
**Left Panel - Digital Twin:**
- Toggle between your photo and mannequin
- Adjust proportions with sliders
- See live design preview

**Right Panel - Outfit Customizer:**
1. Choose outfit type (8 options)
2. Customize neckline, sleeves, back, length, fit
3. Select colors from undertone-matched palette
4. Use manual design slot for custom ideas
5. Review design summary
6. Click "Get Styling Recommendations"

### Step 6: View Recommendations
Review AI-generated advice:
- Why this design works for you
- Accessory recommendations
- Makeup suggestions
- Things to avoid
- Tailor notes

Click "Export for Tailor" when ready

### Step 7: Export for Tailoring
1. Choose export format:
   - PDF (recommended) - Complete specifications
   - Image - Design sketch
   - WhatsApp - Quick share
2. Review export preview
3. Click "Export as [FORMAT]"
4. Share with your tailor!

---

## 🎨 Key Features to Test

### Image Validation
- Try uploading a dark image → Should reject
- Try uploading a bright/overexposed image → Should reject
- Try uploading a landscape image → Should reject
- Upload a proper portrait → Should accept

### Digital Twin
- Adjust sliders → See real-time updates
- Toggle photo/mannequin view → See both modes
- Watch outfit overlay on your photo

### Outfit Types
Test different outfit types:
- Saree & Blouse → See pleating options
- Lehenga Choli → See flared skirt
- Anarkali → See flowing design
- Salwar Kameez → See traditional style

### Color Matching
- Select colors → See undertone warnings
- Use custom color picker → Test hex values
- Switch undertones → See different palettes

### Manual Design
- Toggle to manual mode
- Describe custom design
- Switch back to AI mode

### Export
- Generate PDF → Check specifications
- Generate image → Check design sketch
- Share WhatsApp → Check message format

---

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're on localhost or HTTPS
- Check browser permissions
- Try file upload instead

### Image Validation Failing
- Ensure good lighting
- Take full-body photo (shoulders to hips)
- Stand upright with neutral clothing
- Avoid direct bright light

### Slow Performance
- Close other browser tabs
- Clear browser cache
- Restart development server

### Build Errors
```bash
# Clean install
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📱 Mobile Testing

### Using Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select iPhone or Android device
4. Test all features

### Using Real Device
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://[YOUR_IP]:3000`
3. Test camera, touch interactions, PWA install

---

## 🎯 Production Build

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📚 Documentation

- **README.md** - Complete project overview
- **AYLA_BRANDING.md** - Brand identity guide
- **UPDATES_SUMMARY.md** - All recent changes
- **DEPLOYMENT.md** - Deployment instructions

---

## 🎉 Success Checklist

- [ ] Application loads without errors
- [ ] Welcome screen shows Ayla branding
- [ ] Image upload and validation works
- [ ] Digital twin displays correctly
- [ ] Outfit customization is responsive
- [ ] Color selection shows undertone palettes
- [ ] Recommendations are generated
- [ ] Export creates proper files
- [ ] Mobile view is functional
- [ ] All animations are smooth

---

## 💡 Tips for Best Experience

1. **Use good lighting** for photo capture
2. **Wear fitted clothes** for accurate silhouette
3. **Try different outfit types** to see variety
4. **Experiment with colors** to see undertone matching
5. **Use manual design slot** for creative ideas
6. **Export and share** with a real tailor for feedback

---

## 🆘 Need Help?

### Common Questions

**Q: Why was my image rejected?**
A: Check lighting, ensure full body is visible, avoid overexposure

**Q: Can I skip undertone analysis?**
A: Yes! Click "Skip this step" at the bottom

**Q: How do I save my design?**
A: Export it and save the file, or take screenshots

**Q: Can I design multiple outfits?**
A: Yes! Click "Create New Design" after exporting

**Q: Is my photo stored?**
A: No! Images are processed locally and deleted immediately

---

**Ayla - From Silhouette to Stitch, Designed on You**

Ready to design? Open **http://localhost:3000** and start your journey! 🚀