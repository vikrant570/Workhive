import MessageNotification from "../../components/global_compns/MessageNotification";
import UserSidebar from "@/components/fixednav_compns/UserSideBar";
import { UserContextProvider } from "@/contexts/UserContext";

export default function UserSideLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <UserSidebar />
      <MessageNotification />
      {children}
    </UserContextProvider>
  );
}
