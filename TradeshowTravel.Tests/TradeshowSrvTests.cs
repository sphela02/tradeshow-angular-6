using Microsoft.VisualStudio.TestTools.UnitTesting;
using TradeshowTravel.Domain;

namespace TradeshowTravel.Tests
{
    [TestClass]
    public class TradeshowSrvTests
    {
        [TestMethod]
        public void Get_User_Name_From_Domain()
        {
            Assert.AreEqual(@"HARRIS\\jbaldw99".GetUserName(), "jbaldw99");
        }

        [TestMethod]
        public void Get_User_Name_From_Email()
        {
            Assert.AreEqual("jbaldw99@harris.com".GetUserName(), "jbaldw99");
        }

        [TestMethod]
        public void Get_User_Name_From_Domain_And_Email()
        {
            Assert.AreEqual(@"HARRIS\\jbaldw99@harris.com".GetUserName(), "jbaldw99");
        }

        [TestMethod]
        public void Get_User_Name_Identity()
        {
            string identity = "jbaldw99";

            Assert.AreEqual(identity, identity);
        }

        [TestMethod]
        public void Get_User_Name_Null()
        {
            string identity = null;

            Assert.AreEqual(identity.GetUserName(), string.Empty);
        }
    }
}
