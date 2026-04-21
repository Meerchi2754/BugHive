export const checkName = async (userName: string) => {
  const nameList = await fetch("api/onboarding/checkUserName", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: userName }),
  });
  if (!nameList.ok) return false;
  const data = await nameList.json();
  console.log("Data:", data);

  return !data.data;
};
