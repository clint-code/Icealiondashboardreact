import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  userName: string;
  userRole: string;
  onSignOut: () => void;
}

export function Header({ userName, userRole, onSignOut }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">I</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#AFCB09] rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">ICEA Lion</h1>
            <p className="text-xs text-muted-foreground">E-KYC Portal</p>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium text-foreground"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
