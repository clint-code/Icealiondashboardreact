import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Eye, Calendar, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { ExportButton } from './ExportButton';

interface EKYCRequest {
  id: string;
  createdAt: string;
  requestSource: string;
  searchData: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  division: 'general_insurance' | 'asset_management';
}

interface EKYCRequestsTableProps {
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
}

export function EKYCRequestsTable({ userRole }: EKYCRequestsTableProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [requests, setRequests] = useState<EKYCRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize filters from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDivision, setSelectedDivision] = useState(searchParams.get('division') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // Fetch E-KYC requests from API
  const fetchRequests = async (filters?: { search?: string; division?: string; startDate?: string; endDate?: string }) => {
    setIsLoading(true);
    setError(null);

    // Use provided filters or fall back to state
    const search = filters?.search !== undefined ? filters.search : searchTerm;
    const division = filters?.division !== undefined ? filters.division : selectedDivision;
    const start = filters?.startDate !== undefined ? filters.startDate : startDate;
    const end = filters?.endDate !== undefined ? filters.endDate : endDate;

    try {
      // Build query params for API call
      const params = new URLSearchParams();
      params.append('role', userRole);
      if (search) params.append('search', search);
      if (division) params.append('division', division);
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      // In production, replace this with actual API call:
      // const response = await fetch(`/api/ekyc-requests?${params.toString()}`);
      // const data = await response.json();
      // setRequests(data.requests);

      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data
      const mockRequests: EKYCRequest[] = [
          {
            id: '64794',
            createdAt: '06/05/2026 13:39:30',
            requestSource: 'IPRS_Q',
            searchData: '13484018',
            reference: 'bcd5a9b-152f-4a20-9f6a-80e76746465f',
            status: 'completed',
            division: 'general_insurance',
          },
          {
            id: '64793',
            createdAt: '06/05/2026 13:30:41',
            requestSource: 'IPRS_Q',
            searchData: '37861584',
            reference: 'a7c05ba-6697-437a-a23e-6c69fb467dda',
            status: 'completed',
            division: 'general_insurance',
          },
          {
            id: '64792',
            createdAt: '06/05/2026 13:29:59',
            requestSource: 'IPRS_Q',
            searchData: '39313801',
            reference: '69eb9df4-f934-46e8-867b-281570784b3c',
            status: 'failed',
            division: 'asset_management',
          },
          {
            id: '64791',
            createdAt: '06/05/2026 13:29:23',
            requestSource: 'IPRS_Q',
            searchData: '30134853',
            reference: 'a63bf6d8b-06b3-4c7a-920a-60b9270e41f6',
            status: 'completed',
            division: 'general_insurance',
          },
          {
            id: '64790',
            createdAt: '06/05/2026 13:07:54',
            requestSource: 'IPRS_Q',
            searchData: '29669141',
            reference: 'ef85bf97b9a6-fc9f1266932836',
            status: 'completed',
            division: 'asset_management',
          },
          {
            id: '64789',
            createdAt: '06/05/2026 12:58:42',
            requestSource: 'IPRS_Q',
            searchData: '32480340',
            reference: '6a3f1566f3d3-93933856',
            status: 'failed',
            division: 'general_insurance',
          },
          {
            id: '64788',
            createdAt: '06/05/2026 12:56:04',
            requestSource: 'IPRS_Q',
            searchData: '43245989',
            reference: '6a51b7ac-b5f1-4a95-8e9f-639136693237974',
            status: 'completed',
            division: 'asset_management',
          },
          {
            id: '64787',
            createdAt: '06/05/2026 12:55:40',
            requestSource: 'IPRS_Q',
            searchData: '32404158',
            reference: '48ae832c-2da3-47b0-a9b0-a4a9c7a3f3b1',
            status: 'completed',
            division: 'general_insurance',
          },
        ];

      setRequests(mockRequests);
    } catch (err) {
      setError('Failed to load E-KYC requests. Please try again.');
      console.error('Error fetching E-KYC requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load 10 most recent records on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSearch = () => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDivision) params.set('division', selectedDivision);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    setSearchParams(params);

    // Reset to first page
    setCurrentPage(1);
    setSelectedRows(new Set());

    // Fetch data
    fetchRequests();
  };

  const handleClear = () => {
    // Clear all filters
    setSearchTerm('');
    setSelectedDivision('');
    setStartDate('');
    setEndDate('');
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
    setSelectedRows(new Set());

    // Fetch 10 most recent records with cleared filters
    fetchRequests({ search: '', division: '', startDate: '', endDate: '' });
  };

  // Pagination calculations (filtering is done on backend)
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedRequests.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedRequests.map(req => req.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const isAllSelected = paginatedRequests.length > 0 && selectedRows.size === paginatedRequests.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < paginatedRequests.length;

  // Prepare data for export
  const dataToExport = selectedRows.size > 0
    ? requests.filter(req => selectedRows.has(req.id))
    : requests;

  const exportData = dataToExport.map(req => ({
    'ID': req.id,
    'Created On': req.createdAt,
    ...(userRole === 'super_admin' ? { 'Division': req.division === 'general_insurance' ? 'General Insurance' : 'Asset Management' } : {}),
    'Request Source': req.requestSource,
    'Search Data': req.searchData,
    'Reference': req.reference,
    'Status': req.status,
  }));

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Helper function for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-border p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="ml-3 text-muted-foreground">Loading E-KYC requests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-border p-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <p className="text-destructive font-medium mb-2">Failed to Load Requests</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">E-KYC Search Requests</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage customer verification requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedRows.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedRows.size} selected
              </span>
            )}
            <ExportButton
              data={exportData}
              filename={`ekyc-requests-${new Date().toISOString().split('T')[0]}`}
              variant="primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by ID, reference, or search data..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {userRole === 'super_admin' && (
            <div className="relative min-w-[200px]">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                <option value="">All Divisions</option>
                <option value="general_insurance">General Insurance</option>
                <option value="asset_management">Asset Management</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          <div className="relative min-w-[160px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="relative min-w-[160px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors font-medium text-sm h-10"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors font-medium text-sm text-foreground h-10"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-input cursor-pointer"
                />
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Created On
              </th>
              {userRole === 'super_admin' && (
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Division
                </th>
              )}
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Request Source
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Search Data
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Reference
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRequests.map((request) => (
              <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(request.id)}
                    onChange={() => toggleSelectRow(request.id)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">
                  {request.id}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {request.createdAt}
                </td>
                {userRole === 'super_admin' && (
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      request.division === 'general_insurance'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {request.division === 'general_insurance' ? 'General Insurance' : 'Asset Management'}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-foreground">
                  {request.requestSource}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {request.searchData}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono text-xs">
                  {request.reference}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/ekyc-requests/${request.id}`)}
                    className="px-3 py-1.5 bg-foreground text-background text-xs rounded hover:opacity-80 transition-opacity flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    See Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{requests.length > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">{Math.min(endIndex, requests.length)}</span> of{' '}
            <span className="font-medium text-foreground">{requests.length}</span> requests
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-input rounded hover:bg-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input hover:bg-accent'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-input rounded hover:bg-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
