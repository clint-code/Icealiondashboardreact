import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-border shadow-xl p-8 max-w-md w-full text-center">
        <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm mx-auto mb-6">
          <span className="text-white font-bold text-2xl">I</span>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#AFCB09] rounded-full border-2 border-white"></div>
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium text-foreground"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-4 py-2 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md text-sm font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
