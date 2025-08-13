using Deshawns.Models;
using Deshawns.Models.DTOs;

List<Dog> dogs = new List<Dog>()
{
    new Dog()
    {
        Id = 1,
        Name = "Astara",
        CityId = 1,
        WalkerId = 1,
    },
    new Dog()
    {
        Id = 2,
        Name = "Luna",
        CityId = 1,
        WalkerId = null,
    },
    new Dog()
    {
        Id = 3,
        Name = "Dash",
        CityId = 2,
        WalkerId = null,
    },

};

List<City> cities = new List<City>()
{
    new City()
    {
        Id = 1,
        Name = "Nashville",
    },
    new City()
    {
        Id = 2,
        Name = "Chicago",
    },
    new City()
    {
        Id = 3,
        Name = "St. Louis",
    },
};

List<Walker> walkers = new List<Walker>()
{
    new Walker()
    {
        Id = 1,
        Name = "Chris Huff",
    },
    new Walker()
    {
        Id = 2,
        Name = "Ketzel Pretzel",
    },
};

List<WalkerCity> walkerCities = new List<WalkerCity>()
{
    new WalkerCity()
    {
        WalkerId = 1,
        CityId = 1,
    },
    new WalkerCity()
    {
        WalkerId = 1,
        CityId = 2,
    },
    new WalkerCity()
    {
        WalkerId = 2,
        CityId = 1,
    },
    new WalkerCity()
    {
        WalkerId = 2,
        CityId = 3,
    },
};

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

/*                  DOGS                    */

app.MapGet("/api/dogs", () =>
{
    return dogs.Select(d => new DogDTO
    {
        Id = d.Id,
        Name = d.Name,
        CityId = d.CityId,
        CityName = d.CityId.HasValue ? cities.FirstOrDefault(c => c.Id == d.CityId)?.Name : null,
        WalkerId = d.WalkerId,
        WalkerName = d.WalkerId.HasValue ? walkers.FirstOrDefault(w => w.Id == d.WalkerId)?.Name : null,
    }).ToList();
});

app.MapGet("api/dogs/{id}", (int id) =>
{
    Dog dog = dogs.FirstOrDefault(d => d.Id == id);

    if (dog == null)
    {
        return Results.NotFound();
    }

    City city = cities.FirstOrDefault(c => c.Id == dog.CityId);
    Walker walker = walkers.FirstOrDefault(w => w.Id == dog.WalkerId);

    return Results.Ok(new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        CityId = dog.CityId,
        CityName = city?.Name,
        WalkerId = dog.WalkerId,
        WalkerName = walker?.Name
    });
});

app.MapPost("/api/dogs", (DogDTO createDogDto) =>
{
    // Set the new ID and clear walker assignment
    createDogDto.Id = dogs.Any() ? dogs.Max(d => d.Id) + 1 : 1;
    createDogDto.WalkerId = null;
    createDogDto.WalkerName = null;

    // Create the Dog model from the DTO
    Dog newDog = new Dog
    {
        Id = createDogDto.Id,
        Name = createDogDto.Name,
        CityId = createDogDto.CityId,
        WalkerId = createDogDto.WalkerId
    };

    dogs.Add(newDog);

    // Add city name for the response
    City city = cities.FirstOrDefault(c => c.Id == createDogDto.CityId);
    createDogDto.CityName = city?.Name;

    return Results.Created($"/api/dogs/{createDogDto.Id}", createDogDto);
});

/*                  CITIES                    */

app.MapGet("/api/cities", () =>
{
    return cities.Select(city => new CityDTO
    {
        Id = city.Id,
        Name = city.Name,
    }).ToList();
});

app.Run();
