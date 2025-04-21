import { StatusBar } from "@/components/layout/status-bar";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { UserProfile } from "@/components/profile/user-profile";
import { AccountSettings } from "@/components/profile/account-settings";
import { SupportHelp } from "@/components/profile/support-help";

export default function Profile() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <StatusBar />
      <main className="pt-14 pb-20 h-screen overflow-y-auto no-scrollbar">
        <div className="px-4 py-3">
          <UserProfile />
          <AccountSettings />
          <SupportHelp />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
