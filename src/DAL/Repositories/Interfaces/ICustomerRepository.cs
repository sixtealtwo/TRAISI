// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;

namespace DAL.Repositories.Interfaces {
	public interface ICustomerRepository : IRepository<Customer> {
		IEnumerable<Customer> GetTopActiveCustomers (int count);
		IEnumerable<Customer> GetAllCustomersData ();
	}
}