# SafetyConnect Deployment Guide

This guide will help you deploy the SafetyConnect application to various hosting platforms. The app is now optimized with offline SOS emergency functionality and mobile-responsive design.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for React apps and automatic deployments.

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   npm run build
   npm run deploy:vercel
   ```

3. **Or deploy directly from the web**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the build settings

### Option 2: Netlify

Great for static site hosting with excellent PWA support.

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify's web interface**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder after running `npm run build`

### Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

1. **Enable GitHub Pages** in your repository settings
2. **Use GitHub Actions** (already configured in `.github/workflows/deploy.yml`)
3. **Push to main branch** to trigger automatic deployment

## 🔧 Local Development & Preview

### Development Server
```bash
npm run dev
```
Access at: `http://localhost:3000`

### Production Preview
```bash
npm run build
npm run preview
```
Test the built app locally before deployment.

## 📱 Mobile-Optimized Features

The app now includes:

### ✅ Enhanced Offline SOS Emergency
- **Location Detection**: Automatic GPS location detection for emergency alerts
- **Persistent Storage**: Emergency alerts stored offline and synced when reconnected
- **Visual Feedback**: Enhanced mobile UI with pulse animations and status indicators
- **Emergency Contacts**: Quick access to local emergency hotlines

### ✅ Progressive Web App (PWA)
- **Service Worker**: Caches resources for offline functionality
- **Web App Manifest**: Enables "Add to Home Screen" on mobile devices
- **Offline Mode**: Full offline functionality with emergency features
- **Push Notifications**: Ready for emergency alert notifications

### ✅ Mobile-First Design
- **Responsive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and mobile gestures
- **Status Bar**: Mobile-style status bar in offline mode
- **Card Design**: Modern card-based UI with rounded corners and shadows

## 🛠️ Build Configuration

### Environment Variables
Create a `.env` file for environment-specific settings:

```env
VITE_APP_NAME="SafetyConnect"
VITE_API_URL="https://api.safetyconnect.com"
VITE_MAPBOX_TOKEN="your_mapbox_token"
```

### Build Commands
- `npm run build` - Production build
- `npm run build:analyze` - Build with bundle analysis
- `npm run preview` - Preview production build locally

## 🌐 Domain Setup

### Custom Domain (Vercel)
1. Add your domain in Vercel dashboard
2. Configure DNS records:
   - Type: `CNAME`, Name: `@`, Value: `cname.vercel-dns.com`

### Custom Domain (Netlify)
1. Add domain in Netlify site settings
2. Configure DNS records:
   - Type: `CNAME`, Name: `www`, Value: `your-site.netlify.app`

## 📊 Performance Optimization

The app includes several performance optimizations:

- **Code Splitting**: Automatic code splitting with Vite
- **Asset Optimization**: Optimized images and resources
- **Caching**: Service worker caching for offline performance
- **Compression**: Automatic Gzip/Brotli compression on most platforms

## 🔒 Security Headers

Security headers are configured in deployment files:

- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **HTTPS Enforcement**: Forces secure connections

## 📈 Monitoring & Analytics

### Recommended Tools:
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring and reporting
- **Lighthouse**: Performance auditing

## 🚨 Emergency Features Deployment Checklist

Before deploying to production:

- [ ] Test offline SOS functionality on mobile devices
- [ ] Verify location detection works correctly
- [ ] Confirm emergency contacts are region-appropriate
- [ ] Test service worker caching
- [ ] Validate PWA installation on mobile
- [ ] Check emergency alert storage and sync
- [ ] Test phone number dialing on mobile browsers

## 📞 Support & Maintenance

### Regular Maintenance Tasks:
1. **Update Dependencies**: Monthly security updates
2. **Monitor Performance**: Check Core Web Vitals
3. **Test Emergency Features**: Regular functionality testing
4. **Update Emergency Contacts**: Keep hotlines current
5. **Review Analytics**: Monitor user engagement

## 🛟 Emergency Contact Updates

To update emergency contacts for different regions:

1. Edit `src/utils/locationHotlines.ts`
2. Add city-specific emergency numbers
3. Test location detection accuracy
4. Rebuild and redeploy

## 📝 Deployment Logs

Check deployment logs for any issues:

- **Vercel**: Dashboard → Deployments → View Function Logs
- **Netlify**: Site Dashboard → Deploys → Deploy Log
- **GitHub Pages**: Actions tab → Workflow runs

---

## 🆘 Emergency Deployment

If you need to quickly deploy critical emergency feature updates:

```bash
# Quick deployment pipeline
npm run build && npm run deploy:vercel

# Or for Netlify
npm run build && netlify deploy --prod --dir=dist
```

The offline emergency functionality ensures user safety even during deployment downtime.

---

**SafetyConnect** - Keeping communities safe with reliable technology 🏘️✨

For technical support or deployment issues, please create an issue in the GitHub repository.