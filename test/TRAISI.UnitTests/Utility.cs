using DAL;
using Moq;

namespace TRAISI.UnitTests
{
    public class Utility
    {

        /// <summary>
        /// Creates a Moq UnitOfWork object for unit testing
        /// </summary>
        /// <returns></returns>
        public static IUnitOfWork CreateUnitOfWork()
        {
            IUnitOfWork unitOfWork;
            var mock = new Mock<ApplicationDbContext>();
            unitOfWork = new UnitOfWork(mock.Object, null);
            

            return unitOfWork;
        }
    }
}
