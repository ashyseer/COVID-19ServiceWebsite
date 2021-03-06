using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace WebApi.Models
{ 
    public class City : ICloneable
    {
        [Key]
        public long Id { get; set; }
        public string CityName { get; set; }
        public string CityEnglishName { get; set; }
        public int CurrentConfirmedCount { get; set; }
        public int ConfirmedCount { get; set; }
        public int CuredCount { get; set; }
        public int DeadCount { get; set; }
        public long ProvinceId { get; set; }
        [ForeignKey("ProvinceId")]
        public Province Province { get; set; }
        public string Date { get => Province.Date; set => Date = value; }

        public object Clone()
        {
            return this.MemberwiseClone();
        }

        public City() { }

        public City(string cityName, string date)
        {
            CityName = cityName;
            CurrentConfirmedCount = ConfirmedCount = CuredCount = DeadCount = 0;
            Date = date;
        }
    }
}