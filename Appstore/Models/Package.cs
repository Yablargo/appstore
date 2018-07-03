namespace Appstore.Models
{
    public class Package
    {
        /// <summary>
        /// Guid
        /// </summary>
        public string Id { get; set; }
        public string Title { get; set; }

        /// <summary>
        /// The docker image or similar of the application
        /// </summary>
        public string Image { get; set; }

    }
}