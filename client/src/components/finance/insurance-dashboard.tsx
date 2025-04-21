import { Shield, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface InsurancePolicy {
  id: string;
  type: string;
  icon: React.ReactNode;
  name: string;
  coverage: string;
  expiryInfo: string;
  isExpiringSoon: boolean;
}

export function InsuranceDashboard() {
  const { toast } = useToast();

  // Sample insurance policies
  const policies: InsurancePolicy[] = [
    {
      id: "health1",
      type: "Health Insurance",
      icon: <Shield className="h-5 w-5 text-primary" />,
      name: "Family Floater",
      coverage: "₹5,00,000",
      expiryInfo: "Renews in 43 days",
      isExpiringSoon: true,
    },
    {
      id: "car1",
      type: "Car Insurance",
      icon: <Car className="h-5 w-5 text-primary" />,
      name: "Comprehensive",
      coverage: "₹1,50,000",
      expiryInfo: "Valid till Apr 2024",
      isExpiringSoon: false,
    },
  ];

  const handleViewPolicy = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      toast({
        title: `View ${policy.type} Policy`,
        description: `Viewing policy details for ${policy.name} will be implemented in the full version.`,
      });
    }
  };

  const handleDownloadPolicy = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      toast({
        title: `Download ${policy.type} Policy`,
        description: `Downloading policy document for ${policy.name} will be implemented in the full version.`,
      });
    }
  };

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Insurance</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
        {policies.map((policy, index) => (
          <div
            key={policy.id}
            className={`p-4 ${
              index < policies.length - 1
                ? "border-b border-neutral-200 dark:border-neutral-700"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mr-3">
                  {policy.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{policy.type}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {policy.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{policy.coverage}</p>
                <p
                  className={`text-xs ${
                    policy.isExpiringSoon
                      ? "text-warning"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {policy.expiryInfo}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleViewPolicy(policy.id)}
                variant="outline"
                size="sm"
                className="bg-primary/10 text-primary border-0 text-xs"
              >
                View Details
              </Button>
              <Button
                onClick={() => handleDownloadPolicy(policy.id)}
                variant="outline"
                size="sm"
                className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-0 text-xs"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
