using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using TRAISI.Data.Core;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Groups;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TRAISI.SDK;
using TRAISI.SDK.Enums;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.Questions;
using TRAISI.ViewModels.SurveyBuilder;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.Users;

namespace TRAISI.ViewModels
{
    /// <summary>
    /// AutoMapper profile for survey builder models
    /// </summary>
    public partial class AutoMapperProfile : Profile
    {

        private void CreateSurveyBuilderAutoMapperProfiles()
        {
            CreateMap<SurveyLogicViewModel, SurveyLogic> ();
                //.ForMember( s => s.Expressions, opts =>opts.MapFrom( o => o.Rules));
        }
    }
}