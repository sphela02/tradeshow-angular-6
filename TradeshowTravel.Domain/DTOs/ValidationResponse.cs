using System;

namespace TradeshowTravel.Domain.DTOs
{
    public class ValidationResponse<T> : IDisposable
    {
        protected ValidationResponse()
        {
        }

        public bool Success { get; protected set; }
        public string Message { get; protected set; }
        public T Result { get; protected set; }

        public static ValidationResponse<T> CreateSuccess(T result)
        {
            ValidationResponse<T> response = new ValidationResponse<T>();
            response.Success = true;
            response.Result = result;

            return response;
        }

        public static ValidationResponse<T> CreateFailure(string message)
        {
            ValidationResponse<T> response = new ValidationResponse<T>();
            response.Success = false;
            response.Message = message;

            return response;
        }

        public void Dispose()
        {
            if (Result is IDisposable)
            {
                if (Result != null)
                {
                    ((IDisposable)Result).Dispose();
                }
            }
        }
    }
}
