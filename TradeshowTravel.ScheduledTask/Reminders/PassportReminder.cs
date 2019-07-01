using System;
using System.Configuration;
using System.Linq;
using TradeshowTravel.Domain;

namespace TradeshowTravel.ScheduledTask.Reminders
{
    public class PassportReminder
    {
        private IDataRepository _repo;
        private IReminderSrv _emailSrv;

        public PassportReminder(IDataRepository repo, IReminderSrv emailSrv)
        {
            _repo = repo;
            _emailSrv = emailSrv;
        }

        public int SendReminders()
        {
            var passportReminderInterval = int.Parse(ConfigurationManager.AppSettings["PassportReminderInterval"]);

            var users = _repo.GetActiveUsersWithExpiringPassport()
                .Where(x => (int)Math.Round((x.PassportExpirationDate - DateTime.Now).Value.TotalDays) % passportReminderInterval == 0)
                .ToList();

            users.ForEach(_emailSrv.SendPassportExpiringReminder);

            return users.Count;
        }
    }
}
