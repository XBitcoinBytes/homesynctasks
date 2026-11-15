import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, QrCode, Wallet } from 'lucide-react';

interface BitcoinDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BitcoinDonationModal({ isOpen, onClose }: BitcoinDonationModalProps) {
  const [donationAmount, setDonationAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Example Bitcoin address (replace with your actual donation address)
  const bitcoinAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Bitcoin address has been copied",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the address manually",
        variant: "destructive"
      });
    }
  };

  const generatePaymentURI = () => {
    const amount = parseFloat(donationAmount);
    if (amount > 0) {
      return `bitcoin:${bitcoinAddress}?amount=${amount}`;
    }
    return `bitcoin:${bitcoinAddress}`;
  };

  const handleDonate = () => {
    const uri = generatePaymentURI();
    window.open(uri, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-4 border-orange-400 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-amber-200/20 pointer-events-none" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text flex items-center gap-3">
            <div className="text-4xl">💝</div>
            Support HomeSync Development
            <div className="text-2xl">🚀</div>
          </DialogTitle>
          <DialogDescription className="text-orange-700 font-semibold text-lg">
            Help keep HomeSync running and support new features with cryptocurrency donations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 relative z-10">
          {/* Donation Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg font-bold text-orange-800">
              Donation Amount (Crypto - Optional)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="0.001"
              className="text-lg p-4 bg-white/80 border-3 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
            />
          </div>

          {/* Crypto Address */}
          <div className="space-y-2">
            <Label className="text-lg font-bold text-orange-800">
              Crypto Address
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                value={bitcoinAddress}
                readOnly
                className="text-sm font-mono bg-white/80 border-3 border-orange-300 rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bitcoinAddress)}
                className="border-3 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                {copied ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* QR Code Info */}
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <QrCode className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">QR Code Payment</span>
            </div>
            <p className="text-sm text-orange-700">
              Use your Bitcoin wallet to scan QR codes or click "Open Wallet" to use a compatible wallet app
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg px-6 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Open Crypto Wallet
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-3 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-xl"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => copyToClipboard(bitcoinAddress)}
                variant="outline"
                className="border-3 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-xl"
              >
                Copy Address
              </Button>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-200">
            <p className="text-orange-800 font-medium">
              <span className="text-xl mr-2">🙏</span>
              Thank you for supporting open-source home management tools!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}