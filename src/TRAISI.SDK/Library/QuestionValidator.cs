using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK
{
    public interface ResponseValidator<T>
    {
        bool ValidateResponse(T data);
    }
}