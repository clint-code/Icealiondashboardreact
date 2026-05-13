import { useState } from 'react';
import { X } from 'lucide-react';

interface EmailCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emails: string) => void;
}

export function EmailCredentialsModal({ isOpen, onClose, onSubmit }: EmailCredentialsModalProps) {
  const [emails, setEmails] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateEmails = (emailString: string) => {
    if (!emailString.trim()) {
      setError('Email address is required');
      return false;
    }

    const emailList = emailString.split(',').map(e => e.trim()).filter(e => e);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of emailList) {
      if (!emailRegex.test(email)) {
        setError(`Invalid email address: ${email}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateEmails(emails)) {
      onSubmit(emails);
      setEmails('');
      setError('');
      onClose();
    }
  };

  const handleClose = () => {
    setEmails('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Email Client Credentials</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Emails (Comma separated emails)
            </label>
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter Email Address"
              className={`w-full h-11 px-4 rounded-lg border ${
                error ? 'border-destructive' : 'border-input'
              } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium bg-muted text-foreground"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
