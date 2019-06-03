using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Common.Logging
{
    public class FileLogWriter : BaseLogWriter
    {
        public enum RotationScheme
        {
            /// <summary>
            /// Don't rotate files
            /// </summary>
            None = 0,
            /// <summary>
            /// Rotate files on the first message after midnight
            /// </summary>
            Daily = 1,
            /// <summary>
            /// Rotate files whenever their sizes passes a threshold
            /// </summary>
            Size = 2
        }

        public RotationScheme LogFileRotation { get; protected set; }
        public string Filename { get; set; }
        public uint MaxLogSize { get; set; }
        public uint NumberSavedLogs { get; set; }
        public bool FlushAfterLogMessage { get; set; }
        protected DateTime LastRotateTimestamp { get; set; }

        public FileLogWriter(
            string loggerName,
            string filename,
            LogLevel maxLogLevel = LogLevel.Trace,
            RotationScheme rotation = RotationScheme.Size,
            uint maxFileSize = 10 * 1024 * 1024,
            uint numFiles = 9)
            : base()
        {
            this.Name = loggerName;
            this.MaxLevel = maxLogLevel;
            this.LogFileRotation = rotation;
            this.MaxLogSize = maxFileSize;
            this.NumberSavedLogs = numFiles;
            this.Filename = filename;
            this.FlushAfterLogMessage = true;
            this.LastRotateTimestamp = DateTime.Now;
        }

        protected override void InternalWriteMessage(
            LogLevel level, 
            string appName, 
            string filename, 
            int line, 
            string subsystem, 
            string function, 
            string message)
        {
            if (message == null)
            {
                return;
            }

            lock (this.Mutex)
            {
                this.CheckRotate();
                
                using (StreamWriter writer = File.AppendText(this.Filename))
                {
                    // build message header
                    string header = this.GetLogHeader(level, appName, filename, line, subsystem, function);

                    writer.WriteLine("{0}{1}", header, message);

                    if (this.FlushAfterLogMessage)
                    {
                        writer.Flush();
                    }
                }
            }
        }

        protected string GetLogHeader(
            LogLevel level,
            string appName,
            string filename,
            int line,
            string subsystem,
            string function
            )
        {
            string processName = "unknown";
            int processID = 0;

            Process p = Process.GetCurrentProcess();
            if (p != null)
            {
                processID = p.Id;
                processName = p.ProcessName ?? processName;
            }

            if (!String.IsNullOrWhiteSpace(appName))
            {
                processName = appName;
            }

            return String.Format("{0:yyyy/MM/dd HH:mm:ss.fff}  {1,10}-{2:D5} {{0x{3}}} {4,-15} [{5,4}] {6,20}({7:D4}): {8}()  ",
                DateTime.Now,
                processName,
                processID,
                Thread.CurrentThread.ManagedThreadId.ToString("x8"),
                String.IsNullOrWhiteSpace(subsystem) ? "unknown" : subsystem.Trim(),
                GetShortLogLevelString(level),
                String.IsNullOrWhiteSpace(filename) ? "unknown" : Path.GetFileName(filename),
                line,
                String.IsNullOrWhiteSpace(function) ? "unknown" : function.Trim()
                );
        }

        protected void Rotate()
        {
            lock (this.Mutex)
            {
                string file = Path.GetFileNameWithoutExtension(this.Filename);
                string ext = Path.GetExtension(this.Filename);

                try
                {
                    for (int i = ((int)this.NumberSavedLogs - 1); i > 0; i--)
                    {
                        // If the file exists, move it to the next higher number
                        string srcFile = String.Format("{0}.{1}{2}", file, i, ext);
                        string dstFile = String.Format("{0}.{1}{2}", file, (i + 1), ext);

                        if (!File.Exists(srcFile))
                        {
                            continue;
                        }

                        if (File.Exists(dstFile))
                        {
                            File.Delete(dstFile);
                        }

                        File.Move(srcFile, dstFile);
                    }

                    // Move the main file to the first backup
                    if (File.Exists(this.Filename))
                    {
                        string destination = String.Format("{0}.1{1}", file, ext);

                        if (File.Exists(destination))
                        {
                            File.Delete(destination);
                        }

                        File.Move(this.Filename, destination);
                    }
                }
                catch { }
            }
        }

        protected virtual void CheckRotate()
        {
            lock (this.Mutex)
            {
                switch (this.LogFileRotation)
                {
                    case RotationScheme.Size:
                    {
                        // Only check every 2 minutes
                        if (DateTime.Now.Subtract(this.LastRotateTimestamp).TotalMinutes > 2.0)
                        {
                            FileInfo info = new FileInfo(this.Filename);

                            if (info.Exists)
                            {
                                if (info.Length > this.MaxLogSize)
                                {
                                    this.Rotate();
                                }
                            }

                            this.LastRotateTimestamp = DateTime.Now;
                        }

                        break;
                    }
                    case RotationScheme.Daily:
                    {
                        if (this.LastRotateTimestamp.Day != DateTime.Now.Day)
                        {
                            this.Rotate();
                            this.LastRotateTimestamp = DateTime.Now;
                        }

                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
        }
    }
}
