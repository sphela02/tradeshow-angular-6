using System;
using System.Configuration;
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
            var users = _repo.GetActiveUsersWithExpiringPassport();
            int count = 0;

            foreach (var user in users)
            {
                DateTime expirationDate = user.PassportExpirationDate.ToDateTime().GetValueOrDefault(DateTime.Today);

                // remove hours and seconds
                expirationDate = new DateTime(expirationDate.Year, expirationDate.Month, expirationDate.Day);

                bool sendReminder = expirationDate <= DateTime.Today;

                // check six months out for reminders
                for (int x = 1; x <= 6; x++)
                {
                    DateTime interval = DateTime.Today.AddMonths(x);

                     if (expirationDate == interval)
                    {
                        sendReminder = true;
                    }
                }

                if(sendReminder)
                { 
                    _emailSrv.SendPassportExpiringReminder(user);
                    count++;
                }
            }

            return count;
        }
    }
}
