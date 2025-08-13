namespace Deshawns.Models.DTOs;

public class WalkerDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<CityDTO> Cities { get; set; } = new();
}