using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace Common.Logging
{
    public class LoggingConfig : ConfigurationSection
    {
        public const string SectionName = "LoggingConfig";

        public static LoggingConfig GetConfiguration()
        {
            LoggingConfig config = ConfigurationManager.GetSection(SectionName) as LoggingConfig;

            if (config == null)
            {
                config = new LoggingConfig();
            }

            return config;
        }

        [ConfigurationPropertyAttribute("name", IsRequired = false)]
        public string ApplicationName
        {
            get { return ((string)this["name"]) ?? String.Empty; }
            set { this["name"] = value; }
        }

        [ConfigurationPropertyAttribute("level", DefaultValue = LogLevel.Info, IsRequired = false)]
        public LogLevel MaxLevel
        {
            get { return (LogLevel)this["level"]; }
            set { this["level"] = value; }
        }

        [ConfigurationProperty("SubSystems")]
        [ConfigurationCollection(typeof(SubsystemCollection), AddItemName="add")]
        public SubsystemCollection SubSystems
        {
            get { return (SubsystemCollection)this["SubSystems"]; }
        }

        [ConfigurationProperty("LogWriters")]
        [ConfigurationCollection(typeof(LogWritersCollection), AddItemName="add")]
        public LogWritersCollection LogWriters
        {
            get
            {
                return (LogWritersCollection)base["LogWriters"];
            }
        }
    }

    public class LogWritersCollection : ConfigurationElementCollection
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new LogWriterElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((LogWriterElement)element).Name;
        }
    }

    public class LogWriterElement : ConfigurationElement
    {
        [ConfigurationProperty("name", IsRequired=true)]
        public string Name
        {
            get { return this["name"] as string; }
            set { this["name"] = value; }
        }

        [ConfigurationProperty("connectionString", IsRequired=false)]
        public string ConnectionString
        {
            get { return this["connectionString"] as string; }
            set { this["connectionString"] = value; }
        }

        [ConfigurationProperty("filename", IsRequired=false)]
        public string Filename
        {
            get { return this["filename"] as string; }
            set { this["filename"] = value; }
        }

        [ConfigurationProperty("level", DefaultValue=LogLevel.Trace, IsRequired=false)]
        public LogLevel MaxLogLevel
        {
            get { return (LogLevel)this["level"]; }
            set { this["level"] = value; }
        }

        [ConfigurationProperty("rotation", DefaultValue=FileLogWriter.RotationScheme.Size, IsRequired=false)]
        public FileLogWriter.RotationScheme Rotation
        {
            get { return (FileLogWriter.RotationScheme)this["rotation"]; }
            set { this["rotation"] = value; }
        }

        [ConfigurationProperty("maxsize", DefaultValue=10U * 1024U * 1024U, IsRequired=false)]
        public uint MaxFileSize
        {
            get { return (uint)this["maxsize"]; }
            set { this["maxsize"] = value; }
        }

        [ConfigurationProperty("maxfiles", DefaultValue=9U, IsRequired=false)]
        public uint MaxFiles
        {
            get { return (uint)this["maxfiles"]; }
            set { this["maxfiles"] = value; }
        }

        public BaseLogWriter GetWriter()
        {
            if (!String.IsNullOrWhiteSpace(this.Name))
            {
                if (!String.IsNullOrWhiteSpace(this.Filename))
                {
                    return new FileLogWriter(
                        this.Name,
                        this.Filename,
                        this.MaxLogLevel,
                        this.Rotation,
                        this.MaxFileSize,
                        this.MaxFiles
                        );
                }
                else if (!String.IsNullOrWhiteSpace(this.ConnectionString))
                {
                    return new DatabaseLogWriter(
                        this.Name,
                        this.ConnectionString,
                        this.MaxLogLevel
                        );
                }
                else
                {
                    // Must be console
                    return new ConsoleLogWriter(
                        this.Name, 
                        this.MaxLogLevel
                        );
                }
            }

            return null;
        }
    }

    public class SubsystemCollection : ConfigurationElementCollection
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new SubsystemElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((SubsystemElement)element).Name;
        }
    }

    public class SubsystemElement : ConfigurationElement
    {
        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get { return this["name"] as string; }
            set { this["name"] = value; }
        }

        [ConfigurationProperty("level", DefaultValue = LogLevel.Trace, IsRequired = true)]
        public LogLevel Level
        {
            get { return (LogLevel)this["level"]; }
            set { this["level"] = value; }
        }
    }
}
