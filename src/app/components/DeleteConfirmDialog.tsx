import { AlertCircle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, userName }: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Delete User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-foreground mb-2">
            Are you sure you want to delete <span className="font-semibold">{userName}</span>?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The user will lose access to the system immediately.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity shadow-md text-sm font-medium"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
