import { useState } from 'react';
import { X, Wallet } from 'lucide-react';

interface RequestTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, notes: string) => void;
  division?: string;
}

export function RequestTopUpModal({ isOpen, onClose, onSubmit, division }: RequestTopUpModalProps) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; notes?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { amount?: string; notes?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!notes.trim()) {
      newErrors.notes = 'Please provide a reason for the top-up request';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(parseFloat(amount), notes);
      setAmount('');
      setNotes('');
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setAmount('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Request Account Top-Up</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {division && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Division
                </label>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-foreground">{division}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Top-Up Amount (KES) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full h-10 px-3 rounded-lg border ${
                  errors.amount ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                min="1"
                step="1"
              />
              {errors.amount && (
                <p className="text-xs text-destructive mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason / Notes <span className="text-destructive">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide a reason for this top-up request"
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.notes ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none`}
              />
              {errors.notes && (
                <p className="text-xs text-destructive mt-1">{errors.notes}</p>
              )}
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                Your request will be sent to the MFS Tech team for review. You will be notified once the top-up has been processed and credited to your account.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 pb-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md text-sm font-medium"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
