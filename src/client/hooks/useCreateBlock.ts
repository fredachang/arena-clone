import { useMutation } from "react-query";
import { useAuthContext } from "../context/AuthContext";

interface Variables {
  image_path: string;
  channelId: string;
}

const createBlock = async (
  variables: Variables,
  token?: string
): Promise<string> => {
  const data = await fetch("http://localhost:4000/blocks/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify(variables),
  });
  const res = await data.json();

  return res;
};

export const useCreateBlock = () => {
  const { authToken } = useAuthContext();

  return useMutation<string, Error, Variables>((variables) =>
    createBlock(variables, authToken)
  );
};
