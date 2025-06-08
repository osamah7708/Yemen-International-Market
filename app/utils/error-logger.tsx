interface LogEntry {
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
  details?: any
  context?: any
}

class ErrorLoggerService {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private createLogEntry(level: LogEntry["level"], message: string, details?: any, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      context,
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry)

    // الحفاظ على حد أقصى من السجلات
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // طباعة السجل في وحدة التحكم
    const logMethod = entry.level === "error" ? console.error : entry.level === "warning" ? console.warn : console.log
    logMethod(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.details, entry.context)

    // إرسال السجلات الحرجة إلى الخادم (في التطبيق الحقيقي)
    if (entry.level === "error") {
      this.sendToServer(entry)
    }
  }

  private async sendToServer(entry: LogEntry) {
    try {
      // في التطبيق الحقيقي، سيتم إرسال السجلات إلى خادم المراقبة
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error("Failed to send log to server:", error)
    }
  }

  logInfo(message: string, context?: any) {
    this.addLog(this.createLogEntry("info", message, null, context))
  }

  logWarning(message: string, details?: any, context?: any) {
    this.addLog(this.createLogEntry("warning", message, details, context))
  }

  logError(message: string, error?: any, context?: any) {
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error

    this.addLog(this.createLogEntry("error", message, errorDetails, context))
  }

  getLogs(level?: LogEntry["level"]): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level)
    }
    return [...this.logs]
  }

  getErrorLogs(): LogEntry[] {
    return this.getLogs("error")
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const ErrorLogger = new ErrorLoggerService()
