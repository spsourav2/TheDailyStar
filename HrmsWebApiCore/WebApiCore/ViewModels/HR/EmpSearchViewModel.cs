using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiCore.ViewModels.HR
{
    public class EmpSearchViewModel
    {
        public string EmpCode { get; set; }
        public int Id { get; set; }
        public string EmpName { get; set; }
        public int DepartmentID { get; set; }
        public decimal? Amount { get; set; }
        public string Department { get; set; }
        public string OfficeBranch { get; set; }
        public int DesignationID { get; set; }
        public  string Designation { get; set; }
        public int JobLocation { get; set; }
        public int CompanyID { get; set; }
        public int GradeValue { get; set; }
        public DateTime joinDate { get; set; }
        public string IsBlock { get; set; }
        public string Status { get; set; }
        public string LSDate { get; set; }
        public string leaveNumber { get; set; }
        public string Emp { get; set; }
        public string Lates { get; set; }
        public string TotalEmp { get; set; }
        public string TotalAbsent { get; set; }
        public string Leave { get; set; }
    }
}
