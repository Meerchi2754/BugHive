import MaintainerNavbar from "@/component/maintainer/MaintainerNavbar";
import MaintainerSideBar from "@/component/maintainer/MaintainerSidebar";

export default function MaintainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-col">
      <MaintainerNavbar />
      <div className="flex flex-1 items-stretch overflow-hidden">
        <MaintainerSideBar />
        <div className="flex-1 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
}
