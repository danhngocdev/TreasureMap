namespace TreasureHuntAPI.Models
{
    public class TreasureMap
    {
        public int Id { get; set; }
        public int Rows { get; set; }
        public int Cols { get; set; }
        public int P { get; set; }
        public string MatrixJson { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public double Result { get; set; }

    }
}
