import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename: string;
  variant?: 'primary' | 'secondary';
}

export function ExportButton({ data, filename, variant = 'secondary' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      exportToCSV(data, filename);
    } else {
      exportToExcel(data, filename);
    }
    setIsOpen(false);
  };

  const buttonClasses = variant === 'primary'
    ? 'flex items-center gap-2 px-4 py-2 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium text-sm'
    : 'flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors text-sm';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-10 overflow-hidden">
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Export as CSV</p>
              <p className="text-xs text-muted-foreground">Comma-separated values</p>
            </div>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left border-t border-border"
          >
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Export as Excel</p>
              <p className="text-xs text-muted-foreground">Microsoft Excel format</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
