export const getAllDogs = async () => {
  const res = await fetch("/api/dogs");
  return res.json();
};
