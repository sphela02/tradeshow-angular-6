using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;

namespace TradeshowTravel.Data
{
    public static class Encrypt
    {
        private const int KEY_SIZE = 256;

        private const string INIT_VECTOR = "@182c3D4eVF6g7HB";
        private const string SALT = "$@LT&K3Y";

        public static byte[] EncryptByte(byte[] bdata, string password)
        {
            if (bdata == null || bdata.Length == 0 || string.IsNullOrWhiteSpace(password))
            {
                return bdata;
            }

            byte[] initVectorBytes = Encoding.UTF8.GetBytes(INIT_VECTOR);
            //byte[] plainTextBytes = Encoding.UTF8.GetBytes(bdata);
            byte[] saltBytes = Encoding.UTF8.GetBytes(SALT);

            PasswordDeriveBytes passwordBytes = new PasswordDeriveBytes(password, saltBytes);
            byte[] keyBytes = passwordBytes.GetBytes(KEY_SIZE / 8);

            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);

            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                {
                    cs.Write(bdata, 0, bdata.Length);
                    cs.FlushFinalBlock();

                    return ms.ToArray();
                }
            }
        }

        public static byte[] DecryptByte(byte[] cipherbdata, string password)
        {
            if (cipherbdata == null || cipherbdata.Length == 0 || string.IsNullOrWhiteSpace(password))
            {
                return cipherbdata;
            }

            byte[] cipherTextBytes = cipherbdata;

            //try
            ///{
            //    cipherTextBytes = Convert.FromBase64String(cipherbdata);
            //}
            //catch (FormatException)
            //{
            //    return cipherbdata;
            //}

            byte[] initVectorBytes = Encoding.UTF8.GetBytes(INIT_VECTOR);
            byte[] saltBytes = Encoding.UTF8.GetBytes(SALT);

            PasswordDeriveBytes passwordBytes = new PasswordDeriveBytes(password, saltBytes);
            byte[] keyBytes = passwordBytes.GetBytes(KEY_SIZE / 8);

            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes))
            {
                using (var ms = new MemoryStream(cipherTextBytes))
                {
                    using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        byte[] plainTextBytes = new byte[cipherTextBytes.Length];
                        int decryptedByteCount = cs.Read(plainTextBytes, 0, plainTextBytes.Length);

                        byte[] decryptedBuffer = new byte[decryptedByteCount];
                        Buffer.BlockCopy(plainTextBytes, 0, decryptedBuffer, 0, decryptedByteCount);

                        return decryptedBuffer;

                        //var text = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);

                        //if (!string.IsNullOrWhiteSpace(text))
                        //{
                        //    text = text.TrimEnd(new char[] { '\0' });
                        //}

                        //return text;
                    }
                }
            }
        }

        public static string EncryptString(string text, string password)
        {
            if (string.IsNullOrWhiteSpace(text) || string.IsNullOrWhiteSpace(password))
            {
                return text;
            }

            byte[] initVectorBytes = Encoding.UTF8.GetBytes(INIT_VECTOR);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(text);
            byte[] saltBytes = Encoding.UTF8.GetBytes(SALT);

            PasswordDeriveBytes passwordBytes = new PasswordDeriveBytes(password, saltBytes);
            byte[] keyBytes = passwordBytes.GetBytes(KEY_SIZE / 8);

            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);

            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                {
                    cs.Write(plainTextBytes, 0, plainTextBytes.Length);
                    cs.FlushFinalBlock();

                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        public static string DecryptString(string cipherText, string password)
        {
            if (string.IsNullOrWhiteSpace(cipherText) || string.IsNullOrWhiteSpace(password))
            {
                return cipherText;
            }

            byte[] cipherTextBytes = null;

            try
            {
                cipherTextBytes = Convert.FromBase64String(cipherText);
            }
            catch (FormatException)
            {
                return cipherText;
            }

            byte[] initVectorBytes = Encoding.UTF8.GetBytes(INIT_VECTOR);
            byte[] saltBytes = Encoding.UTF8.GetBytes(SALT);

            PasswordDeriveBytes passwordBytes = new PasswordDeriveBytes(password, saltBytes);
            byte[] keyBytes = passwordBytes.GetBytes(KEY_SIZE / 8);

            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes))
            {
                using (var ms = new MemoryStream(cipherTextBytes))
                {
                    using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        byte[] plainTextBytes = new byte[cipherTextBytes.Length];
                        int decryptedByteCount = cs.Read(plainTextBytes, 0, plainTextBytes.Length);

                        var text = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);

                        if (!string.IsNullOrWhiteSpace(text))
                        {
                            text = text.TrimEnd(new char[] { '\0' });
                        }

                        return text;
                    }
                }
            }
        }
    }

  // moved to encrypt.cs
  //  public class Encrypted : Attribute
  //  { }

}
