using Deshawns.Models;
using Deshawns.Models.DTOs;
using Microsoft.AspNetCore.HttpLogging;

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

// Assign a walker to a dog
app.MapPut("/api/dogs/{dogId}/walker", (int dogId, WalkerDTO walkerData) =>
{
    Dog dog = dogs.FirstOrDefault(d => d.Id == dogId);
    if (dog == null)
    {
        return Results.NotFound("Dog not found");
    }

    dog.WalkerId = walkerData.Id;

    // Return updated dog details
    City city = cities.FirstOrDefault(c => c.Id == dog.CityId);
    Walker walker = walkers.FirstOrDefault(w => w.Id == dog.WalkerId);

    var updatedDogDTO = new DogDTO
    {
        Id = dog.Id,
        Name = dog.Name,
        CityId = dog.CityId,
        CityName = city?.Name,
        WalkerId = dog.WalkerId,
        WalkerName = walker?.Name
    };

    return Results.Ok(updatedDogDTO);
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

/*                  WALKERS                    */

app.MapGet("/api/walkers", (int? cityId) =>
{
    if (cityId.HasValue)
    {
        // Filter by specific city
        var walkerIdsInCity = walkerCities
            .Where(wc => wc.CityId == cityId.Value)
            .Select(wc => wc.WalkerId)
            .Distinct();

        var walkersInCity = walkers
            .Where(w => walkerIdsInCity.Contains(w.Id))
            .Select(walker =>
            {
                var walkerCityIds = walkerCities
                    .Where(wc => wc.WalkerId == walker.Id)
                    .Select(wc => wc.CityId);

                var walkerCityDTOs = cities
                    .Where(c => walkerCityIds.Contains(c.Id))
                    .Select(c => new CityDTO { Id = c.Id, Name = c.Name })
                    .ToList();

                return new WalkerDTO
                {
                    Id = walker.Id,
                    Name = walker.Name,
                    Cities = walkerCityDTOs
                };
            })
            .ToList();

        return Results.Ok(walkersInCity);
    }
    else
    {
        // Return ALL walkers
        var allWalkerDTOs = walkers
            .Select(walker =>
            {
                var walkerCityIds = walkerCities
                    .Where(wc => wc.WalkerId == walker.Id)
                    .Select(wc => wc.CityId);

                var walkerCityDTOs = cities
                    .Where(c => walkerCityIds.Contains(c.Id))
                    .Select(c => new CityDTO { Id = c.Id, Name = c.Name })
                    .ToList();

                return new WalkerDTO
                {
                    Id = walker.Id,
                    Name = walker.Name,
                    Cities = walkerCityDTOs
                };
            })
            .ToList();

        return Results.Ok(allWalkerDTOs);
    }
});

//Get dogs available for a specific walker
app.MapGet("/api/walkers/{walkerId}/available-dogs", (int walkerId) =>
{
    //Get cities where this walker works
    var walkerCityIds = walkerCities
        .Where(wc => wc.WalkerId == walkerId)
        .Select(wc => wc.CityId)
        .ToList();

    // Get dogs that are:
    // 1. In the walker's cities
    // 2. Not already assigned to this walker
    var availableDogs = dogs
        .Where(d => d.CityId.HasValue &&
            walkerCityIds.Contains(d.CityId.Value) &&
            d.WalkerId != walkerId)
        .Select(dog =>
        {
            City city = cities.FirstOrDefault(c => c.Id == dog.CityId);
            Walker currentWalker = dog.WalkerId.HasValue ? walkers.FirstOrDefault(w => w.Id == dog.WalkerId) : null;

            return new DogDTO
            {
                Id = dog.Id,
                Name = dog.Name,
                CityId = dog.CityId,
                CityName = city?.Name,
                WalkerId = dog.WalkerId,
                WalkerName = currentWalker?.Name
            };
        }).ToList();

    return Results.Ok(availableDogs);

});

app.Run();
