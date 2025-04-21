import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  upiId?: string;
  phone?: string;
}

interface RecipientSearchProps {
  onSelect: (recipient: Recipient) => void;
}

export default function RecipientSearch({ onSelect }: RecipientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for recent contacts - in a real app, this would come from an API
  const recentContacts: Recipient[] = [
    { id: "1", name: "Vikram", avatar: "" },
    { id: "2", name: "Priya", avatar: "" },
    { id: "3", name: "Rahul", avatar: "" },
    { id: "4", name: "Neha", avatar: "" },
    { id: "5", name: "Arjun", avatar: "" },
  ];

  // Filter contacts based on search query
  const filteredContacts = searchQuery
    ? recentContacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentContacts;

  const handleRecipientSelect = (recipient: Recipient) => {
    onSelect(recipient);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm mb-6">
      <CardContent className="p-0">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, UPI ID, or phone"
            className="pl-10 pr-4 py-2 w-full text-sm dark:bg-slate-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h3 className="text-sm font-medium mb-3 dark:text-gray-300">Recent</h3>
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              onClick={() => handleRecipientSelect(contact)}
            >
              <Avatar className="w-12 h-12 rounded-full mb-1">
                <AvatarImage src={contact.avatar || ""} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-center dark:text-gray-300">
                {contact.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
