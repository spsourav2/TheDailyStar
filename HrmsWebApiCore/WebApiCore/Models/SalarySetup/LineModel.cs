﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiCore.Models.SalarySetup
{
    public class LineModel
    {
        public int ID { get; set; }
        public int FloreID { get; set; }
        public string Description { get; set; }
        public int UserID { get; set; }
        public int CompanyID { get; set; }
    }
}
