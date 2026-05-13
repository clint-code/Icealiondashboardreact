import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, message: string, priority: string) => void;
  userName: string;
  userRole: string;
}

export function ContactSupportModal({ isOpen, onClose, onSubmit, userName, userRole }: ContactSupportModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { subject?: string; message?: string } = {};

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(subject, message, priority);
      setSubject('');
      setMessage('');
      setPriority('medium');
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setSubject('');
    setMessage('');
    setPriority('medium');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Contact Support</h2>
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
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-foreground">{userName}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-foreground">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority <span className="text-destructive">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Standard support</option>
                <option value="high">High - Urgent issue</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className={`w-full h-10 px-3 rounded-lg border ${
                  errors.subject ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed information about your request or issue..."
                rows={6}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.message ? 'border-destructive' : 'border-input'
                } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none`}
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1">{errors.message}</p>
              )}
            </div>

            {/* Support Info */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">
                <span className="font-medium text-foreground">Support Hours:</span> Monday - Friday, 8:00 AM - 6:00 PM EAT
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span> support@mfstech.co.ke
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
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
