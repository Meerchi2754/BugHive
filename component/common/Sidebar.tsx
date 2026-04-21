"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({
  items,
}: {
  items: {
    icons: React.ReactNode;
    link: string;
    name: string;
  }[];
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="flex flex-col w-48 bg-mist-950 px-4 py-6 gap-4 text-center justify-center border-r border-white">
      {items.map((i) => (
        <div key={i.link} className="flex flex-row gap-2 items-center">
          {i.icons}
          <Link
            href={i.link}
            className={` hover:text-gray-500 ${isActive(i.link) ? "text-blue-600 font-bold" : "text-white"}`}
          >
            {i.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
