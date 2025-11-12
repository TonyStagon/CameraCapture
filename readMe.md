# Question Capture Camera App

A React Native Expo app that captures, crops, and processes questions from photos - similar to Gauth and Brainly. Includes comprehensive logging for debugging and performance monitoring.

## 📁 Project Structure

```
question-capture-app/
├── App.tsx                          # Main app entry point
├── package.json                     # Dependencies
├── app.json                         # Expo configuration
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel configuration
├── metro.config.js                  # Metro bundler config
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Navigation setup
│   │
│   ├── screens/
│   │   ├── CameraScreen.tsx        # Camera capture screen
│   │   ├── CropScreen.tsx          # Crop adjustment screen
│   │   └── PreviewScreen.tsx       # Final preview screen
│   │
│   ├── components/
│   │   ├── CropBox.tsx             # Interactive crop box
│   │   ├── CropHandles.tsx         # Resize handles
│   │   └── ToggleButton.tsx        # Auto/Manual toggle
│   │
│   ├── services/
│   │   ├── logging.ts              # Comprehensive logging system
│   │   ├── imageProcessor.ts       # Image cropping utilities
│   │   └── cropDetection.ts        # Auto-detection service
│   │
│   ├── utils/
│   │   ├── imageUtils.ts           # Image manipulation helpers
│   │   └── constants.ts            # App constants
│   │
│   └── types/
│       └── index.ts                # TypeScript types
│
└── assets/                         # App icons and images
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: macOS with Xcode
- For Android: Android Studio with Android SDK

### Installation

1. **Create the project directory:**

```bash
mkdir question-capture-app
cd question-capture-app
```

2. **Initialize Expo project:**

```bash
npx create-expo-app@latest . --template blank-typescript
```

3. **Install dependencies:**

```bash
npm install expo-camera expo-image-manipulator @react-navigation/native @react-navigation/native-stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-svg
```

4. **Copy all the code files** from the artifacts into their respective locations in the directory structure above.

5. **Update your `app.json`** with camera permissions (see Part 1 artifact).

6. **Update your `babel.config.js`** to include reanimated plugin (see Part 3 artifact).

### Running the App

**Development mode:**

```bash
npx expo start
```

**Run on Android:**

```bash
npx expo start --android
```

**Run on iOS:**

```bash
npx expo start --ios
```

**Run on Web (limited functionality):**

```bash
npx expo start --web
```

### Building for Production

**Android APK:**

```bash
eas build --platform android --profile preview
```

**iOS:**

```bash
eas build --platform ios --profile preview
```

## 🎯 Features

### 1. Camera Capture

- Native camera interface
- Permission handling
- Clean, intuitive UI matching Gauth/Brainly style
- Full-screen capture

### 2. Crop Functionality

- **Auto Mode**: Automatic question detection
- **Manual Mode**: Drag and resize crop box
- Smooth animations with react-native-reanimated
- Corner handles for precise adjustments
- Real-time preview

### 3. Comprehensive Logging System

The app includes a production-ready logging system that tracks:

#### Camera Events

- Initialization and permissions
- Photo capture timing
- Camera errors

#### Crop Operations

- Auto-detection performance
- Manual adjustments (drag, resize)
- Processing time

#### Performance Metrics

- Frame drops
- Render times
- Memory warnings
- Operation durations

#### User Actions

- Every button tap
- Mode toggles
- Navigation events

### 4. Image Processing

- High-quality JPEG compression
- Efficient cropping with `expo-image-manipulator`
- Maintains aspect ratios

## 📊 Using the Logging System

### Basic Usage

```typescript
import { logger } from "./src/services/logging";

// Log user actions
logger.photoCaptureTapped();

// Track timing
logger.photoCaptureStart();
// ... do work ...
logger.photoCaptureEnd();

// Log errors
try {
  await someOperation();
} catch (error) {
  logger.cameraError(error, "operation context");
}
```

### Accessing Logs

```typescript
// Get all logs
const allLogs = logger.getLogs();

// Filter by level
const errors = logger.getLogs({ level: LogLevel.ERROR });

// Filter by category
const perfLogs = logger.getLogs({ category: LogCategory.PERFORMANCE });

// Get metrics summary
const metrics = logger.getMetricsSummary();
console.log(metrics);
// Output:
// {
//   photo_capture_ms: { count: 5, average: 234, min: 198, max: 289 },
//   crop_processing_ms: { count: 3, average: 156, min: 142, max: 178 }
// }

// Export as JSON
const jsonLogs = logger.exportLogsAsJSON();
```

### Sending to Analytics

The logger includes a `flushToAnalytics()` method. Implement your backend:

```typescript
// In src/services/logging.ts
async flushToAnalytics() {
  const payload = {
    sessionId: this.sessionId,
    logs: this.getLogs({ level: LogLevel.ERROR }),
    metrics: this.getMetricsSummary()
  };

  // Replace with your endpoint
  await fetch('https://your-api.com/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
```

## 🔧 Customization

### Adjust Crop Detection Algorithm

Edit `src/services/cropDetection.ts`:

```typescript
async detectQuestionBounds(imageUri: string, dimensions: ImageDimensions) {
  // Replace mock with actual ML model
  // Options:
  // 1. TensorFlow.js for on-device ML
  // 2. Cloud Vision API (Google, AWS Rekognition)
  // 3. Custom trained model with OpenCV
}
```

### Change UI Styling

Update `src/utils/constants.ts`:

```typescript
export const COLORS = {
  primary: "#007AFF", // Main accent color
  background: "#000000", // App background
  cropBox: "rgba(255, 255, 255, 0.8)",
  // ... etc
};
```

### Add Analytics Integration

Popular options:

- **Firebase Analytics**: `expo install @react-native-firebase/analytics`
- **Amplitude**: `npm install @amplitude/analytics-react-native`
- **Mixpanel**: `npm install mixpanel-react-native`

## 🐛 Debugging

### View Logs in Real-Time

```typescript
// In any component
useEffect(() => {
  const interval = setInterval(() => {
    console.log(logger.exportLogsAsJSON());
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### Common Issues

**Camera not working:**

- Check permissions in `app.json`
- Run `npx expo prebuild` to regenerate native files
- Ensure device/simulator has camera access enabled

**Gestures not responding:**

- Verify `react-native-gesture-handler` is in `babel.config.js`
- Wrap app with `GestureHandlerRootView` (already done in App.tsx)

**Performance issues:**

- Check logs for frame drops: `logger.getLogs({ category: LogCategory.PERFORMANCE })`
- Reduce image resolution in camera settings
- Optimize crop box updates

## 📈 Performance Optimization

### Already Implemented

- ✅ Reanimated for 60fps animations
- ✅ Throttled crop updates
- ✅ Efficient image manipulation
- ✅ Performance metric tracking

### Future Enhancements

- [ ] Image caching
- [ ] Lazy loading for preview
- [ ] Web worker for heavy processing
- [ ] Progressive image loading

## 🧪 Testing

```bash
# Run type checking
npx tsc --noEmit

# Run linter (if configured)
npm run lint
```

## 📱 Platform-Specific Notes

### Android

- Minimum SDK: 21 (Android 5.0)
- Target SDK: 33 (Android 13)
- Camera permissions automatically requested

### iOS

- iOS 13.0+
- Camera usage description required
- Photo library access may be needed for saving

## 🤝 Contributing

When adding new features:

1. Add appropriate logging calls
2. Update TypeScript types in `src/types/`
3. Follow existing naming conventions
4. Test on both iOS and Android

## 📄 License

MIT License - feel free to use this in your projects!

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)

## 🎓 Learning Resources

- **Gauth App Study**: Download and analyze their UX flow
- **Brainly App Study**: Examine their auto-detection patterns
- **Image Processing**: Learn about edge detection algorithms
- **Mobile Performance**: React Native performance optimization

---

**Questions or Issues?** Check the logs first! The logging system captures most common problems automatically.
