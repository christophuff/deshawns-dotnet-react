namespace Deshawns.Models;

public class WalkerCity
{
    public int WalkerId { get; set; }
    public Walker Walker { get; set; }
    public int CityId { get; set; }
    public City City { get; set; }

}