using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Common.Logging
{
    public class Logger
    {
        #region Singleton

        private static volatile Logger instance;
        private static object syncRoot = new object();

        public static Logger Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new Logger();
                        }
                    }
                }

                return instance;
            }
        }

        #endregion

        public LogLevel MaxLevel { get; set; }

        private ReaderWriterLockSlim WriterLock { get; set; }
        private ReaderWriterLockSlim SubsystemLock { get; set; }
        private Dictionary<string, LogLevel> SubsystemLogLevels { get; set; }
        private Dictionary<string, BaseLogWriter> LogWriters { get; set; }
        public string ApplicationName { get; set; }

        private Logger()
        {
            this.WriterLock = new ReaderWriterLockSlim();
            this.SubsystemLock = new ReaderWriterLockSlim();
            this.SubsystemLogLevels = new Dictionary<string, LogLevel>();
            this.LogWriters = new Dictionary<string, BaseLogWriter>();
        }

        public void Initialize(string applicationName = null)
        {
            LoggingConfig config = LoggingConfig.GetConfiguration();

            this.ApplicationName = String.IsNullOrWhiteSpace(config.ApplicationName) ? applicationName : config.ApplicationName;
            this.MaxLevel = config.MaxLevel;

            if (config.SubSystems != null && config.SubSystems.Count > 0)
            {
                foreach (SubsystemElement element in config.SubSystems)
                {
                    this.SetSubsystemMaxLogLevel(element.Name, element.Level);
                }
            }

            if (config.LogWriters != null && config.LogWriters.Count > 0)
            {
                foreach (LogWriterElement element in config.LogWriters)
                {
                    this.AddWriter(element.GetWriter());
                }
            }
        }

        public LogLevel GetSubsystemMaxLogLevel(string subsystem)
        {
            if (!String.IsNullOrWhiteSpace(subsystem))
            {
                subsystem = subsystem.Trim().ToUpper();

                try
                {
                    this.SubsystemLock.EnterReadLock();

                    if (this.SubsystemLogLevels.ContainsKey(subsystem))
                    {
                        return this.SubsystemLogLevels[subsystem];
                    }
                }
                finally
                {
                    this.SubsystemLock.ExitReadLock();
                }
            }

            return this.MaxLevel;
        }

        public void SetSubsystemMaxLogLevel(string subsystem, LogLevel level)
        {
            if (String.IsNullOrWhiteSpace(subsystem))
            {
                return;
            }

            subsystem = subsystem.Trim().ToUpper();

            try
            {
                this.SubsystemLock.EnterWriteLock();
                this.SubsystemLogLevels[subsystem] = level;
            }
            finally
            {
                this.SubsystemLock.ExitWriteLock();
            }
        }

        public void RemoveSubsystem(string subsystem)
        {
            if (String.IsNullOrWhiteSpace(subsystem))
            {
                return;
            }

            subsystem = subsystem.Trim().ToUpper();

            try
            {
                this.SubsystemLock.EnterWriteLock();
                this.SubsystemLogLevels.Remove(subsystem);
            }
            finally
            {
                this.SubsystemLock.ExitWriteLock();
            }
        }

        public bool AddWriter(BaseLogWriter writer)
        {
            if (writer == null)
            {
                return false;
            }
            else if (String.IsNullOrWhiteSpace(writer.Name))
            {
                return false;
            }

            try
            {
                this.WriterLock.EnterUpgradeableReadLock();

                if (this.LogWriters.ContainsKey(writer.Name))
                {
                    return false;
                }

                foreach (BaseLogWriter w in this.LogWriters.Values)
                {
                    if (w == writer)
                    {
                        return false;
                    }
                }

                this.WriterLock.EnterWriteLock();

                this.LogWriters[writer.Name] = writer;

                return true;
            }
            finally
            {
                if (this.WriterLock.IsWriteLockHeld)
                {
                    this.WriterLock.ExitWriteLock();
                }

                this.WriterLock.ExitUpgradeableReadLock();
            }
        }

        public void RemoveWriter(string name)
        {
            if (String.IsNullOrWhiteSpace(name))
            {
                return;
            }

            try
            {
                this.WriterLock.EnterUpgradeableReadLock();

                if (this.LogWriters.ContainsKey(name))
                {
                    this.WriterLock.EnterWriteLock();

                    this.LogWriters.Remove(name);
                }
            }
            finally
            {
                if (this.WriterLock.IsWriteLockHeld)
                {
                    this.WriterLock.ExitWriteLock();
                }

                this.WriterLock.ExitUpgradeableReadLock();
            }
        }

        public void ClearWriters()
        {
            try
            {
                this.WriterLock.EnterWriteLock();
                this.LogWriters.Clear();
            }
            finally
            {
                this.WriterLock.ExitWriteLock();
            }
        }

        public void LogMessage(
            LogLevel level, 
            string message
            )
        {
            StackFrame caller = new StackFrame(1, true);

            this.LogSubMessage(level, null, caller, message, null);
        }

        public void LogMessage(
            LogLevel level, 
            string format, 
            params object[] args)
        {
            StackFrame caller = new StackFrame(1, true);

            this.LogSubMessage(level, null, caller, format, args);
        }

        public void LogSubMessage(
            LogLevel level,
            string subsystem,
            string message)
        {
            StackFrame caller = new StackFrame(1, true);

            this.LogSubMessage(level, subsystem, caller, message, null);
        }

        public void LogSubMessage(
            LogLevel level,
            string subsystem,
            string format,
            params object[] args)
        {
            StackFrame caller = new StackFrame(1, true);

            this.LogSubMessage(level, subsystem, caller, format, args);
        }

        public void LogSubMessage(
            LogLevel level,
            string subsystem,
            StackFrame caller,
            string format,
            params object[] args)
        {
            int line = 0;
            string filename = null, method = "(null)", cls = "(null)";

            if (caller != null)
            {
                filename = caller.GetFileName();
                line = caller.GetFileLineNumber();

                if (caller.GetMethod() != null)
                {
                    method = caller.GetMethod().Name;

                    if (caller.GetMethod().DeclaringType != null)
                    {
                        cls = caller.GetMethod().DeclaringType.Name;
                    }
                }
            }

            string func = String.Format("{0}.{1}", cls, method);

            this.LogSubMessage(level, filename, line, subsystem, func, format, args);
        }

        protected void LogSubMessage(
            LogLevel level,
            string filename,
            int line,
            string subsystem,
            string function,
            string format,
            params object[] args)
        {
            if (format == null)
            {
                return;
            }
            else if (level == LogLevel.Nothing)
            {
                return;
            }

            if (level > this.GetSubsystemMaxLogLevel(subsystem))
            {
                return;
            }

            try
            {
                this.WriterLock.EnterReadLock();

                if (this.LogWriters.Count == 0)
                {
                    return;
                }

                string message = format;

                // build message string
                if (args != null && args.Length > 0)
                {
                    message = String.Format(format, args);
                }

                // Log to all writers
                foreach (BaseLogWriter writer in this.LogWriters.Values)
                {
                    writer.WriteMessage(level, this.ApplicationName, filename, line, subsystem, function, message);
                }
            }
            finally
            {
                this.WriterLock.ExitReadLock();
            }
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public class Logging
    {
        public static string ApplicationName
        {
            get { return Logger.Instance.ApplicationName; }
            set { Logger.Instance.ApplicationName = value; }
        }

        public static LogLevel MaxLevel
        {
            get { return Logger.Instance.MaxLevel; }
            set { Logger.Instance.MaxLevel = value; }
        }

        public static void Initialize(string applicationName = null)
        {
            Logger.Instance.Initialize(applicationName);
        }

        public static void AddWriter(BaseLogWriter writer)
        {
            Logger.Instance.AddWriter(writer);
        }

        public static void AddFileWriter(
            string loggerName,
            string filename,
            LogLevel maxLogLevel = LogLevel.Trace,
            FileLogWriter.RotationScheme rotation = FileLogWriter.RotationScheme.Size,
            uint maxFileSize = 10 * 1024 * 1024,
            uint numFiles = 9)
        {
            Logger.Instance.AddWriter(new FileLogWriter(loggerName, filename, maxLogLevel, rotation, maxFileSize, numFiles));
        }

        public static void RemoveWriter(string loggerName)
        {
            Logger.Instance.RemoveWriter(loggerName);
        }

        public static void ClearWriters()
        {
            Logger.Instance.ClearWriters();
        }

        public static void LogMessage(LogLevel level, string message)
        {
            StackFrame caller = new StackFrame(1, true);

            Logger.Instance.LogSubMessage(level, null, caller, message, null);
        }

        public static void LogMessage(LogLevel level, string format, params object[] args)
        {
            StackFrame caller = new StackFrame(1, true);

            Logger.Instance.LogSubMessage(level, null, caller, format, args);
        }

        public static void LogSubMessage(LogLevel level, string subsystem, string message)
        {
            StackFrame caller = new StackFrame(1, true);

            Logger.Instance.LogSubMessage(level, subsystem, caller, message, null);
        }

        public static void LogSubMessage(LogLevel level, string subsystem, string format, params object[] args)
        {
            StackFrame caller = new StackFrame(1, true);

            Logger.Instance.LogSubMessage(level, subsystem, caller, format, args);
        }
    }
}
