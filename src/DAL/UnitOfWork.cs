// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Repositories;
using DAL.Repositories.Interfaces;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;

        ISurveyRepository _surveys;
        ISurveyPermissionsRepository _surveyPermissions;
        IUserGroupRepository _userGroups;
        IGroupMemberRepository _groupMembers;
				IApiKeysRepository _apiKeys;
				IShortcodeRepository _shortcodes;
				IGroupCodeRepository _groupCodes;
        ISurveyViewRepository _surveyViews;
        IQuestionPartRepository _questionParts;

        public UnitOfWork(ApplicationDbContext context, ISurveyRepository surveyRepository = null)
        {
            _context = context;
            _surveys = surveyRepository;
        }

        public ISurveyViewRepository SurveyViews
        {
            get
            {
                if (_surveyViews == null)
                {
                    _surveyViews = new SurveyViewRepository(_context);
                }

                return _surveyViews;
            }
        }

        public ISurveyRepository Surveys
        {
            get
            {
                if (_surveys == null)
                    _surveys = new SurveyRepository(_context);

                return _surveys;
            }
        }

        public ISurveyPermissionsRepository SurveyPermissions
        {
            get
            {
                if (_surveyPermissions == null)
                    _surveyPermissions = new SurveyPermissionsRepository(_context);

                return _surveyPermissions;
            }
        }

        public IGroupMemberRepository GroupMembers
        {
            get
            {
                if (_groupMembers == null)
                    _groupMembers = new GroupMemberRepository(_context);

                return _groupMembers;
            }
        }

        public IUserGroupRepository UserGroups
        {
            get
            {
                if (_userGroups == null)
                    _userGroups = new UserGroupRepository(_context);

                return _userGroups;
            }
        }

				public IApiKeysRepository ApiKeys
        {
            get
            {
                if (_apiKeys == null)
                    _apiKeys = new ApiKeysRepository(_context);

                return _apiKeys;
            }
        }

				public IShortcodeRepository Shortcodes 
				{
						get
						{
									if (_shortcodes == null)
											_shortcodes = new ShortcodeRepository(_context);

									return _shortcodes;
						}
				}

				public IGroupCodeRepository GroupCodes 
				{
						get
						{
									if(_groupCodes == null)
									{
										_groupCodes = new GroupCodeRepository(_context);
									}

									return _groupCodes;
						}
				}

        public IQuestionPartRepository QuestionParts
        {
            get
            {
                if (_questionParts == null)
                {
                    _questionParts = new QuestionPartRepository(_context);
                }

                return _questionParts;
            }
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}