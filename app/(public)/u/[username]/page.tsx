import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function Username({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  return (
    <>
      <h1>{username}</h1>
    </>
  );
}
