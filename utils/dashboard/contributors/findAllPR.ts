type prListObject = {
  pr_url: string;
};
export async function findAllPR() {
  const prList = await fetch("/api/getAllPR");
  if (!prList.ok) {
    throw new Error("Failed to fetch PR list.");
  }
  const { data } = await prList.json();
  const list = data.map((i: prListObject) => i.pr_url);
  return list;
}
