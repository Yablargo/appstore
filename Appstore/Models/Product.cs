using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Appstore.Models
{
    public class CatalogEntry
    {
        /// <summary>
        /// Guid
        /// </summary>
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<string> Pictures { get; set; }
        public ICollection<Package> Packages { get; set; }
    }
}
