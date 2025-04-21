import { useAuth } from "@/contexts/auth-context";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

export function PaymentQRCode() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShareQRCode = () => {
    toast({
      title: "Share QR Code",
      description: "QR Code sharing functionality will be implemented in the full version.",
    });
  };

  const handleDownloadQRCode = () => {
    toast({
      title: "Download QR Code",
      description: "QR Code download functionality will be implemented in the full version.",
    });
  };

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Your QR Code</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm flex flex-col items-center">
        <div className="w-48 h-48 bg-white p-2 rounded-lg mb-3">
          <div className="w-full h-full bg-white rounded flex items-center justify-center">
            <QRCode
              size={160}
              value={user?.upiId || "rahul@okaxis"}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
            />
          </div>
        </div>
        <p className="text-sm font-medium mb-1">{user?.upiId || "rahul@okaxis"}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          Scan to pay me
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleShareQRCode}
            className="flex items-center text-primary text-sm"
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownloadQRCode}
            className="flex items-center text-primary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
