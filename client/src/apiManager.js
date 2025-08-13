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
