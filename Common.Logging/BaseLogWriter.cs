using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Common.Logging
{
    public enum LogLevel : int
    {
        /// <summary>
        /// Nothing is logged
        /// </summary>
        Nothing = 0,
        /// <summary>
        /// Fatal error occurred
        /// </summary>
        Fatal = 1,
        /// <summary>
        /// General error occurred
        /// </summary>
        Error = 2,
        /// <summary>
        /// Suspicious application behavior occurred, but application
        /// should is still functional.
        /// </summary>
        Warning = 3,
        /// <summary>
        /// General information
        /// </summary>
        Info = 4,
        /// <summary>
        /// Basic debug information
        /// </summary>
        DebugBasic = 5,
        /// <summary>
        /// Detailed debug information
        /// </summary>
        DebugDetailed = 6,
        /// <summary>
        /// Very detailed debug information from within loops and recursive methods. 
        /// Generates the highest amount of log messages.
        /// </summary>
        Trace = 7
    }

    public abstract class BaseLogWriter
    {
        public static string GetShortLogLevelString(LogLevel level)
        {
            switch (level)
            {
                case LogLevel.Nothing:
                    return "----";
                case LogLevel.Fatal:
                    return "FATL";
                case LogLevel.Error:
                    return "ERR!";
                case LogLevel.Warning:
                    return "WARN";
                case LogLevel.Info:
                    return "INFO";
                case LogLevel.DebugBasic:
                    return "DEBG";
                case LogLevel.DebugDetailed:
                    return "DBG+";
                default:
                    return "????";
            }
        }

        public string Name { get; protected set; }

        public LogLevel MaxLevel { get; set; }

        public object Mutex { get; protected set; }

        protected BaseLogWriter()
        {
            this.Mutex = new object();
        }

        public virtual void WriteMessage(
            LogLevel level,
            string appName,
            string filename,
            int line,
            string subsystem,
            string function,
            string message)
        {
            lock (this.Mutex)
            {
                if ((level <= this.MaxLevel) && !String.IsNullOrWhiteSpace(message))
                {
                    this.InternalWriteMessage(level, appName, filename, line, subsystem, function, message);
                }
            }
        }

        protected abstract void InternalWriteMessage(
            LogLevel level,
            string appName,
            string filename,
            int line,
            string subsystem,
            string function,
            string message
            );
    }
}
