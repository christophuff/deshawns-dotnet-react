export const getAllDogs = async () => {
  const res = await fetch("/api/dogs");
  return res.json();
};

export const getDogById = async (id) => {
  const res = await fetch(`/api/dogs/${id}`);
  return res.json();
};

export const createDog = async (dogData) => {
  const res = await fetch(`/api/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dogData),
  });
  return res.json();
};

export const getAllCities = async () => {
  const res = await fetch(`/api/cities`);
  return res.json();
};

export const getAllWalkers = async (cityId = null) => {
  const url = cityId ? `/api/walkers?cityId=${cityId}` : `/api/walkers`;
  const res = await fetch(url);
  return res.json();
};

export const getAvailableDogsForWalker = async (walkerId) => {
  const res = await fetch(`/api/walkers/${walkerId}/available-dogs`);
  return res.json();
}

export const assignWalkerToDog = async(dogId, walkerId) => {
  const res = await fetch(`/api/dogs/${dogId}/walker`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: walkerId, name: "", cities: [] }),
  });
  return res.json();
}

export const createCity = async (cityData) => {
  const res = await fetch(`/api/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cityData),
  });
  return res.json();
};