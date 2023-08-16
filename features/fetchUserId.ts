export const fetchUserId = async () => {
  const res = await fetch("/api/session/jwt");
  const data = await res.json();
  console.log("data", data);

  return data.sub;
};
