namespace TreasureHuntAPI.Models
{
    public class TreasureMapDto
    {
        public int Rows { get; set; }
        public int Cols { get; set; }
        public int P { get; set; }
        public int[][] Matrix { get; set; }
    }
}
