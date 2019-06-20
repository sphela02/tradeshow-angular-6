using Microsoft.VisualStudio.TestTools.UnitTesting;

using TradeshowTravel.Domain;

namespace TradeshowTravel.Tests
{
    [TestClass]
    public class LdapSrvTests
    {
        [TestMethod]
        public void Get_Email_Address_From_Ldap()
        {
            Assert.AreEqual(LdapSrv.GetLdapEmailAddress("jbaldw99"), "jbaldw99@harris.com");
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
    }
}
