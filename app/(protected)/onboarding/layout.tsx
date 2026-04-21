"use client";

export default function OnBoardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-300 text-black  min-h-screen flex flex-col items-center justify-center px-4">
      {children}
    </div>
  );
}
