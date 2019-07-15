using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TradeshowTravel.Data;
using TradeshowTravel.Domain;

namespace TradeshowTravel.Tests
{
    [TestClass]
    public class LdapSrvTests
    {
        [TestMethod]
        public void Get_Email_Address_From_Ldap()
        {
            Assert.AreEqual(LdapSrv.GetLdapEmailAddress("jbaldw99"), "Jason.Baldwin@l3harris.com");
        }

        [TestMethod]
        public void Get_Email_Address_From_Ldap_Bad_User_Name()
        {
            Assert.AreEqual(LdapSrv.GetLdapEmailAddress("010203040506070809"), string.Empty);
        }

        [TestMethod]
        public void Get_Email_Address_From_Ldap_Null_User_Name()
        {
            Assert.AreEqual(LdapSrv.GetLdapEmailAddress(null), string.Empty);
        }

        [TestMethod]
        public void Update_L3Harris_Email_Addresses()
        {
            var repo = new TSDataRepository();

            var users = repo.GetAllUserProfiles().Where(x => string.IsNullOrWhiteSpace(x.Email) || x.Email.Contains("harris.com") || !x.Email.Contains("@")).ToList();

            foreach (var user in users)
            {
                user.Email = LdapSrv.GetLdapEmailAddress(user.Username);

                repo.SaveProfile(user);
            }
        }
    }
}
