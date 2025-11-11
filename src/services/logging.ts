// ============================================
// FILE: src/services/logging.ts
// ============================================
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  METRIC = 'METRIC'
}

export enum LogCategory {
  CAMERA = 'CAMERA',
  CROP = 'CROP',
  PERFORMANCE = 'PERFORMANCE',
  USER_ACTION = 'USER_ACTION',
  ERROR_TRACKING = 'ERROR_TRACKING',
  UI = 'UI',
  APP = 'APP'
}

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
  sessionId: string;
}

class CameraLogger {
  private logs: LogEntry[] = [];
  private sessionId: string;
  private maxLogs: number = 1000;
  private metricsBuffer: Map<string, number[]> = new Map();
  private timers: Map<string, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(level: LogLevel, category: LogCategory, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      metadata,
      sessionId: this.sessionId
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (__DEV__) {
      const logMethod = level === LogLevel.ERROR ? console.error : 
                       level === LogLevel.WARN ? console.warn : console.log;
      logMethod(`[${category}] ${message}`, metadata || '');
    }
  }

  appLaunched() {
    this.log(LogLevel.INFO, LogCategory.APP, 'App launched', {
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  cameraInitialized(permissions: { granted: boolean }) {
    this.log(LogLevel.INFO, LogCategory.CAMERA, 'Camera initialized', { permissions });
  }

  cameraPermissionDenied() {
    this.log(LogLevel.WARN, LogCategory.CAMERA, 'Camera permission denied');
  }

  cameraError(error: Error, context?: string) {
    this.log(LogLevel.ERROR, LogCategory.ERROR_TRACKING, 'Camera error', {
      error: error.message,
      stack: error.stack,
      context
    });
  }

  photoCaptureTapped() {
    this.log(LogLevel.INFO, LogCategory.USER_ACTION, 'Capture button tapped');
  }

  photoCaptureStart() {
    this.startTimer('photo_capture');
  }

  photoCaptured(uri: string, dimensions: { width: number; height: number }) {
    const duration = this.endTimer('photo_capture');
    this.logMetric('photo_capture_ms', duration);
    this.log(LogLevel.INFO, LogCategory.CAMERA, 'Photo captured', { uri, dimensions, duration });
  }

  photoCaptureEnd() {
    this.endTimer('photo_capture');
  }

  cropModeToggled(autoMode: boolean) {
    this.log(LogLevel.INFO, LogCategory.USER_ACTION, 'Crop mode toggled', { autoMode });
  }

  autoCropDetectionStart() {
    this.startTimer('auto_crop_detection');
    this.log(LogLevel.DEBUG, LogCategory.CROP, 'Auto crop detection started');
  }

  autoCropDetectionEnd(success: boolean, boundingBox?: any) {
    const duration = this.endTimer('auto_crop_detection');
    this.logMetric('auto_crop_detection_ms', duration);
    this.log(success ? LogLevel.INFO : LogLevel.WARN, LogCategory.CROP, 
      `Auto crop ${success ? 'succeeded' : 'failed'}`, { duration, boundingBox });
  }

  cropBoxResized(newBounds: any) {
    this.log(LogLevel.DEBUG, LogCategory.CROP, 'Crop box resized', { newBounds });
  }

  cropBoxDragged(newPosition: any) {
    this.log(LogLevel.DEBUG, LogCategory.CROP, 'Crop box dragged', { newPosition });
  }

  retakePhotoTapped() {
    this.log(LogLevel.INFO, LogCategory.USER_ACTION, 'Retake tapped');
  }

  confirmCropTapped(cropRegion: any) {
    this.log(LogLevel.INFO, LogCategory.USER_ACTION, 'Confirm crop tapped', { cropRegion });
  }

  cropProcessingStart() {
    this.startTimer('crop_processing');
  }

  cropProcessingEnd(success: boolean, outputUri?: string) {
    const duration = this.endTimer('crop_processing');
    this.logMetric('crop_processing_ms', duration);
    this.log(success ? LogLevel.INFO : LogLevel.ERROR, LogCategory.CROP, 
      `Crop processing ${success ? 'completed' : 'failed'}`, { duration, outputUri });
  }

  frameDropDetected(count: number) {
    this.log(LogLevel.WARN, LogCategory.PERFORMANCE, 'Frame drops detected', { count });
    this.logMetric('frame_drops', count);
  }

  renderTimeExceeded(component: string, renderTime: number) {
    this.log(LogLevel.WARN, LogCategory.PERFORMANCE, 'Slow render', { component, renderTime });
  }

  navigationToScreen(screenName: string) {
    this.log(LogLevel.INFO, LogCategory.UI, `Navigated to ${screenName}`);
  }

  private startTimer(key: string) {
    this.timers.set(key, Date.now());
  }

  private endTimer(key: string): number {
    const start = this.timers.get(key);
    if (!start) return 0;
    const duration = Date.now() - start;
    this.timers.delete(key);
    return duration;
  }

  private logMetric(metricName: string, value: number) {
    if (!this.metricsBuffer.has(metricName)) {
      this.metricsBuffer.set(metricName, []);
    }
    this.metricsBuffer.get(metricName)!.push(value);

    this.log(LogLevel.METRIC, LogCategory.PERFORMANCE, `Metric: ${metricName}`, {
      value,
      average: this.getAverageMetric(metricName)
    });
  }

  private getAverageMetric(metricName: string): number {
    const values = this.metricsBuffer.get(metricName) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getLogs(filter?: { level?: LogLevel; category?: LogCategory; since?: number }): LogEntry[] {
    let filtered = this.logs;

    if (filter) {
      if (filter.level) {
        const level = filter.level;
        filtered = filtered.filter(log => log.level === level);
      }
      if (filter.category) {
        const category = filter.category;
        filtered = filtered.filter(log => log.category === category);
      }
      if (typeof filter.since === 'number' && filter.since > 0) {
        const sinceTimestamp = filter.since;
        filtered = filtered.filter(log => log.timestamp >= sinceTimestamp);
      }
    }

    return filtered;
  }

  getMetricsSummary() {
    const summary: Record<string, any> = {};
    this.metricsBuffer.forEach((values, metricName) => {
      if (values.length > 0) {
        summary[metricName] = {
          count: values.length,
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    return summary;
  }

  exportLogsAsJSON(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportTime: Date.now(),
      logs: this.logs,
      metrics: this.getMetricsSummary()
    }, null, 2);
  }

  async flushToAnalytics() {
    const payload = {
      sessionId: this.sessionId,
      logs: this.logs.filter(l => l.level === LogLevel.ERROR),
      metrics: this.getMetricsSummary()
    };
    console.log('Analytics payload ready:', payload);
  }

  clearLogs() {
    this.logs = [];
    this.metricsBuffer.clear();
    this.log(LogLevel.INFO, LogCategory.UI, 'Logs cleared');
  }
}

export const logger = new CameraLogger();
