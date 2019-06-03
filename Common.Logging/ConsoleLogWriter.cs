using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Common.Logging
{
    public class ConsoleLogWriter : BaseLogWriter
    {
        public ConsoleLogWriter(
            string loggerName,
            LogLevel maxLogLevel = LogLevel.Trace) : base()
        {
            this.Name = loggerName;
            this.MaxLevel = maxLogLevel;
        }

        protected override void InternalWriteMessage(LogLevel level, string appName, string filename, int line, string subsystem, string function, string message)
        {
            if (message != null)
            {
                lock (this.Mutex)
                {
                    // build message header
                    string header = this.GetLogHeader(level, appName, filename, line, subsystem, function);

                    Console.Out.WriteLine(header);
                    Console.Out.WriteLine(message);
                    Console.Out.WriteLine();
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
            int processID = 0;

            Process p = Process.GetCurrentProcess();
            if (p != null)
            {
                processID = p.Id;
            }

            return String.Format("{0:HH:mm:ss.fff}  {1:D5} {{0x{2}}} [{3:4}] {4:20}({5:D4}): {6}()",
                DateTime.Now,
                processID,
                Thread.CurrentThread.ManagedThreadId.ToString("x8"),
                GetShortLogLevelString(level),
                String.IsNullOrWhiteSpace(filename) ? "unknown" : Path.GetFileName(filename),
                line,
                String.IsNullOrWhiteSpace(function) ? "unknown" : function.Trim()
                );
        }
    }
}
