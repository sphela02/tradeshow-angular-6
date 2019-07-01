using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using FizzWare.NBuilder;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using TradeshowTravel.Domain;
using TradeshowTravel.Domain.DTOs;
using TradeshowTravel.ScheduledTask.Reminders;

namespace TradeshowTravel.Tests
{
    [TestClass]
    public class PassportReminderTests
    {
        private int _passportReminderInterval;
        private Mock<IDataRepository> _repo;
        private Mock<IReminderSrv> _emailSrv;

        [TestInitialize]
        public void Setup()
        {
            _passportReminderInterval = int.Parse(ConfigurationManager.AppSettings["PassportReminderInterval"]);
            _repo = new Mock<IDataRepository>();
            _emailSrv = new Moq.Mock<IReminderSrv>();
        }

        [TestMethod]
        public void SendPassportReminder_Near_Expired_Password_On_Interval()
        {
            // Arrange
            var passportExpirationDate = DateTime.Now.AddDays(_passportReminderInterval);
            var userProfiles = Builder<UserProfile>
                .CreateListOfSize(1)
                .All()
                .With(x => x.PassportExpirationDate = passportExpirationDate)
                .Build()
                .ToList();

            _repo.Setup(x => x.GetActiveUsersWithExpiringPassport()).Returns(userProfiles);

            // Act
            var reminder = new PassportReminder(_repo.Object, _emailSrv.Object);
            var result = reminder.SendReminders();

            // Assert
            Assert.AreEqual(result, userProfiles.Count);
        }

        [TestMethod]
        public void SendPassportReminder_Near_Expired_Password_Off_Interval()
        {
            // Arrange
            var passportExpirationDate = DateTime.Now.AddDays(_passportReminderInterval-1);
            var userProfiles = Builder<UserProfile>
                .CreateListOfSize(1)
                .All()
                .With(x => x.PassportExpirationDate = passportExpirationDate)
                .Build()
                .ToList();

            _repo.Setup(x => x.GetActiveUsersWithExpiringPassport()).Returns(userProfiles);

            // Act
            var reminder = new PassportReminder(_repo.Object, _emailSrv.Object);
            var result = reminder.SendReminders();

            // Assert
            Assert.AreEqual(result, 0);
        }

        [TestMethod]
        public void SendPassportReminder_Expired_Password_On_Interval()
        {
            // Arrange
            var passportExpirationDate = DateTime.Now.AddDays(-_passportReminderInterval);
            var userProfiles = Builder<UserProfile>
                .CreateListOfSize(1)
                .All()
                .With(x => x.PassportExpirationDate = passportExpirationDate)
                .Build()
                .ToList();

            _repo.Setup(x => x.GetActiveUsersWithExpiringPassport()).Returns(userProfiles);

            // Act
            var reminder = new PassportReminder(_repo.Object, _emailSrv.Object);
            var result = reminder.SendReminders();

            // Assert
            Assert.AreEqual(result, userProfiles.Count);
        }

        [TestMethod]
        public void SendPassportReminder_Expired_Password_Off_Interval()
        {
            // Arrange
            var passportExpirationDate = DateTime.Now.AddDays(-_passportReminderInterval - 1);
            var userProfiles = Builder<UserProfile>
                .CreateListOfSize(1)
                .All()
                .With(x => x.PassportExpirationDate = passportExpirationDate)
                .Build()
                .ToList();

            _repo.Setup(x => x.GetActiveUsersWithExpiringPassport()).Returns(userProfiles);

            // Act
            var reminder = new PassportReminder(_repo.Object, _emailSrv.Object);
            var result = reminder.SendReminders();

            // Assert
            Assert.AreEqual(result, 0);
        }

        [TestMethod]
        public void SendPassportReminder_Empty_Expiring_Password()
        {
            // Arrange
            var userProfiles = new List<UserProfile>();
            _repo.Setup(x => x.GetActiveUsersWithExpiringPassport()).Returns(userProfiles);

            // Act
            var reminder = new PassportReminder(_repo.Object, _emailSrv.Object);
            var result = reminder.SendReminders();

            // Assert
            Assert.AreEqual(result, 0);
        }
    }
}
