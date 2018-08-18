using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;

namespace TRAISI.SDK
{
    public class QuestionResource
    {
        public string ResourceName { get; set; }

        public byte[] Data { get; set; }

        public string FieldName { get; set; }

    }
}