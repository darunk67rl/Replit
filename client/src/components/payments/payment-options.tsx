import { ScanLine, Command, Building2, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  initials: string;
}

export function PaymentOptions() {
  const { toast } = useToast();

  // Sample frequent contacts
  const frequentContacts: Contact[] = [
    { id: "1", name: "Amit Kumar", initials: "AK" },
    { id: "2", name: "Sneha Patel", initials: "SP" },
    { id: "3", name: "Raj Gupta", initials: "RG" },
    { id: "4", name: "Priya Singh", initials: "PS" },
  ];

  const handlePaymentMethod = (type: string) => {
    toast({
      title: "Payment Method Selected",
      description: `${type} payment method will be implemented in the full version.`,
    });
  };

  const handlePayContact = (contactId: string) => {
    const contact = frequentContacts.find((c) => c.id === contactId);
    if (contact) {
      toast({
        title: "Contact Selected",
        description: `Payment to ${contact.name} will be implemented in the full version.`,
      });
    }
  };

  const handleViewAllContacts = () => {
    toast({
      title: "Coming Soon",
      description: "View all contacts feature will be available in the full version.",
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm mb-5">
      <h3 className="text-lg font-semibold mb-4">UPI Payments</h3>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => handlePaymentMethod("Scan QR")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <ScanLine className="text-primary h-6 w-6" />
          </div>
          <span className="text-xs text-center">Scan QR</span>
        </button>
        <button
          onClick={() => handlePaymentMethod("UPI ID/Number")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <Command className="text-primary h-6 w-6" />
          </div>
          <span className="text-xs text-center">UPI ID/Number</span>
        </button>
        <button
          onClick={() => handlePaymentMethod("Self Transfer")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <Building2 className="text-primary h-6 w-6" />
          </div>
          <span className="text-xs text-center">Self Transfer</span>
        </button>
        <button
          onClick={() => handlePaymentMethod("Request Money")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <FileText className="text-primary h-6 w-6" />
          </div>
          <span className="text-xs text-center">Request</span>
        </button>
      </div>

      <h4 className="text-sm font-medium mb-3">Pay Contacts</h4>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
        {frequentContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handlePayContact(contact.id)}
            className="flex flex-col items-center min-w-[4rem]"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center mb-1">
              <span className="text-base font-medium">{contact.initials}</span>
            </div>
            <span className="text-xs text-center truncate w-16">
              {contact.name}
            </span>
          </button>
        ))}
        <button
          onClick={handleViewAllContacts}
          className="flex flex-col items-center min-w-[4rem]"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center mb-1">
            <span className="material-icons">more_horiz</span>
          </div>
          <span className="text-xs text-center truncate w-16">View All</span>
        </button>
      </div>
    </div>
  );
}
