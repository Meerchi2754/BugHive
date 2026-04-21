import { useMultiStepForm } from "@/context/formContext";
import { checkName } from "@/controller/onboarding/checkName";
import { useDebouncing } from "@/utils/debouncing";
import { useEffect, useState } from "react";

export function Step1Form() {
  const [userName, setUserName] = useState<string>("");
  const debounceValue = useDebouncing(userName, 500);
  const [nameTaken, setNameTaken] = useState(false);

  useEffect(() => {
    if (!debounceValue) return;
    const check = async () => {
      setNameTaken(false);
      const res = await checkName(debounceValue);
      setNameTaken(res);
    };

    check();
  }, [debounceValue]);

  const { form } = useMultiStepForm();
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="py-5">
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        className="border m-3 w-3xs bg-gray-200 rounded border-gray-300 p-2"
        placeholder="Enter Your Name"
        {...register("username", {
          onChange: (e) => setUserName(e.target.value),
        })}
      />
      {nameTaken && (
        <p style={{ color: "red" }}>{`@${debounceValue} is taken.✗`}</p>
      )}
      {!nameTaken && debounceValue && (
        <p style={{ color: "green" }}>{`${debounceValue} is Available.✓ `}</p>
      )}
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message}</p>
      )}
    </div>
  );
}
