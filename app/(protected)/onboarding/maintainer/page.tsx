"use client";
import { useState } from "react";
import { ButtonComp } from "@/component/ui/button";
import { useForm } from "react-hook-form";
import {
  MaintainerFormSchema,
  MaintainerFormType,
} from "@/lib/validations/onboarding/maintainerForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/app/actions/onboarding/maintainers/onboarding";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { refreshCookie } from "@/utils/refreshCookie";

export default function Maintainer() {
  const router = useRouter();
  const form = useForm<MaintainerFormType>({
    resolver: zodResolver(MaintainerFormSchema),
    mode: "onChange",
    defaultValues: {
      techStack: [],
      ecoSystem: [],
    },
  });

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const [techStack, setTechStack] = useState([
    "React",
    "Next.JS",
    "Node.JS",
    "POSTGRESQL",
    "Redis",
    "AWS",
    "DOCKER",
    "KUBERNETES",
  ]);

  const [ecoSystem, setEcoSystem] = useState([
    "React Ecosystem",
    "Dotnet Ecosystem",
    "DevOps Ecosystem",
    "Python Ecosystem",
  ]);

  const selectedTechStack = (watch("techStack") as string[]) ?? [];
  const selectedEcoSystem = (watch("ecoSystem") as string[]) ?? [];

  const selectTechStack = (tag: string) => {
    const currentStack = form.getValues("techStack") ?? [];
    const updatedStack = currentStack.includes(tag)
      ? currentStack.filter((t) => t !== tag)
      : [...currentStack, tag];
    form.setValue("techStack", updatedStack, { shouldValidate: true });
  };

  const selectEcoSystem = (eco: string) => {
    const currentEcoSystem = form.getValues("ecoSystem") ?? [];
    const updatedEcoSystem = currentEcoSystem.includes(eco)
      ? currentEcoSystem.filter((e) => e != eco)
      : [...currentEcoSystem, eco];
    form.setValue("ecoSystem", updatedEcoSystem, { shouldValidate: true });
  };

  const { refreshUser, user } = useAuth();
  const onSubmit = async (data: MaintainerFormType) => {
    if (!user?.email) return;
    const result = await updateUser(data, user?.email!);
    if (!result) {
      router.push("/");
      return;
    }
    await refreshCookie();
    await refreshUser();
    console.log("RESULT:", result);

    router.push("maintainer/shortlist");
  };

  return (
    <>
      <div className="bg-gray-100 w-150 p-4  rounded">
        <h1 className="text-center font-bold text-2xl">
          Maintainer Onboarding Form:
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mt-5">
            <label className="font-bold text-lg">Project/Company Name</label>
            <input
              type="text"
              className="bg-gray-200 rounded border-gray-300 p-2"
              placeholder="Enter your Project/Company Name:"
              {...register("project")}
            />
            {errors.project && (
              <p className="text-red-500 text-xs">{errors.project.message}</p>
            )}
          </div>

          <div className="mt-5">
            <label className="font-bold text-lg">TechStack</label>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <ButtonComp
                  key={t}
                  text={t}
                  onClick={() => {
                    selectTechStack(t);
                  }}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedTechStack.includes(t) ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                />
              ))}
            </div>
            {errors.techStack && (
              <p className="text-red-500 text-xs">{errors.techStack.message}</p>
            )}
          </div>

          <div className="mt-5">
            <label className="font-bold text-lg">Primary Ecosystem</label>
            <div className="flex flex-wrap gap-6">
              {ecoSystem.map((e) => (
                <ButtonComp
                  key={e}
                  text={e}
                  onClick={() => {
                    selectEcoSystem(e);
                  }}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedEcoSystem.includes(e) ? "bg-black text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                />
              ))}
            </div>
            {errors.ecoSystem && (
              <p className="text-red-500 text-xs">{errors.ecoSystem.message}</p>
            )}
          </div>

          <div>
            <ButtonComp
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? "Submitting" : "Submit"}
              className="p-2 mt-5 w-full bg-blue-600 rounded  cursor-pointer hover:bg-blue-900 text-white disabled:bg-gray-600"
            />
          </div>
        </form>
      </div>
    </>
  );
}
