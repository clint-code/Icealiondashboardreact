import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wallet, TrendingUp, Plus, ArrowUpCircle, Search, Calendar, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { RequestTopUpModal } from './RequestTopUpModal';
import { Toast } from './Toast';

interface AccountData {
  division: string;
  accountBalance: number;
  utilisedAmount: number;
  availableBalance: number;
}

interface AccountBillingProps {
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
}

export function AccountBilling({ userRole }: AccountBillingProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDivision, setSelectedDivision] = useState(searchParams.get('division') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpDivision, setTopUpDivision] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const generalInsuranceAccount: AccountData = {
    division: 'General Insurance',
    accountBalance: 850000,
    utilisedAmount: 320000,
    availableBalance: 530000,
  };

  const assetManagementAccount: AccountData = {
    division: 'Asset Management',
    accountBalance: 650000,
    utilisedAmount: 245000,
    availableBalance: 405000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountsToDisplay = (): AccountData[] => {
    if (userRole === 'super_admin') {
      return [generalInsuranceAccount, assetManagementAccount];
    } else if (userRole === 'general_insurance') {
      return [generalInsuranceAccount];
    } else {
      return [assetManagementAccount];
    }
  };

  const accounts = getAccountsToDisplay();

  const fetchTransactions = async (filters?: { search?: string; division?: string; startDate?: string; endDate?: string }) => {
    setIsLoading(true);

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
      // const response = await fetch(`/api/transactions?${params.toString()}`);
      // const data = await response.json();
      // setTransactions(data.transactions);

      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data - in production this comes from API
      const mockTransactions = [
        {
          id: 'TXN001',
          type: 'top_up',
          division: 'General Insurance',
          amount: 500000,
          date: '2026-04-15',
          status: 'completed',
          reference: 'TOPUP-GI-20260415-001',
        },
        {
          id: 'TXN002',
          type: 'usage',
          division: 'General Insurance',
          amount: -45000,
          date: '2026-04-20',
          status: 'completed',
          reference: 'USAGE-GI-20260420-142',
        },
        {
          id: 'TXN003',
          type: 'top_up',
          division: 'Asset Management',
          amount: 400000,
          date: '2026-04-10',
          status: 'completed',
          reference: 'TOPUP-AM-20260410-001',
        },
        {
          id: 'TXN004',
          type: 'usage',
          division: 'Asset Management',
          amount: -32000,
          date: '2026-04-18',
          status: 'completed',
          reference: 'USAGE-AM-20260418-089',
        },
        {
          id: 'TXN005',
          type: 'top_up',
          division: 'Asset Management',
          amount: 300000,
          date: '2026-05-05',
          status: 'pending',
          reference: 'TOPUP-AM-20260505-001',
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDivision) params.set('division', selectedDivision);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    setSearchParams(params);

    // Fetch data with current filters
    fetchTransactions();
    setCurrentPage(1);
    setSelectedTransactions(new Set());
  };

  const handleClear = () => {
    // Clear all filters
    setSearchTerm('');
    setSelectedDivision('');
    setStartDate('');
    setEndDate('');

    // Clear URL params
    setSearchParams(new URLSearchParams());

    setCurrentPage(1);
    setSelectedTransactions(new Set());

    // Fetch 10 most recent transactions with cleared filters
    fetchTransactions({ search: '', division: '', startDate: '', endDate: '' });
  };

  // Load 10 most recent transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedTransactions.size === paginatedTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(paginatedTransactions.map(txn => txn.id)));
    }
  };

  const toggleSelectTransaction = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const isAllSelected = paginatedTransactions.length > 0 && selectedTransactions.size === paginatedTransactions.length;
  const isSomeSelected = selectedTransactions.size > 0 && selectedTransactions.size < paginatedTransactions.length;

  // Prepare data for export
  const dataToExport = selectedTransactions.size > 0
    ? transactions.filter(txn => selectedTransactions.has(txn.id))
    : transactions;

  const exportData = dataToExport.map(txn => ({
    'Reference': txn.reference,
    'Type': txn.type === 'top_up' ? 'Top-Up' : 'Usage',
    ...(userRole === 'super_admin' ? { 'Division': txn.division } : {}),
    'Date': new Date(txn.date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    'Amount (KES)': txn.amount,
    'Status': txn.status,
  }));

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleOpenTopUpModal = (division?: string) => {
    setTopUpDivision(division);
    setIsTopUpModalOpen(true);
  };

  const handleTopUpRequest = (amount: number, notes: string) => {
    // In production, this would send the request to an API
    console.log('Top-up request submitted:', { amount, notes, division: topUpDivision });
    setToast({
      message: `Top-up request for KES ${amount.toLocaleString()} has been submitted successfully!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Account & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your prepaid account and billing information
          </p>
        </div>
        {userRole !== 'super_admin' && (
          <button
            onClick={() => handleOpenTopUpModal(userRole === 'general_insurance' ? 'General Insurance' : 'Asset Management')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            Request Account Top-Up
          </button>
        )}
      </div>

      {/* Division-Specific Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <div key={account.division} className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{account.division}</h3>
              <p className="text-xs text-muted-foreground mt-1">Prepaid Account</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Account Balance Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Balance</p>
                      <p className="text-2xl font-semibold text-foreground">{formatCurrency(account.accountBalance)}</p>
                    </div>
                  </div>
                  {userRole !== 'super_admin' && (
                    <button
                      onClick={() => handleOpenTopUpModal(account.division)}
                      className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      Top-Up
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium text-foreground">
                      {((account.utilisedAmount / account.accountBalance) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(account.utilisedAmount / account.accountBalance) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Balance Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Utilised Amount</p>
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(account.utilisedAmount)}</p>
                </div>
                <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                  <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-lg font-semibold text-success">{formatCurrency(account.availableBalance)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
              <p className="text-sm text-muted-foreground mt-1">Recent account activity and top-ups</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedTransactions.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedTransactions.size} selected
                </span>
              )}
              <ExportButton
                data={exportData}
                filename={`transaction-history-${new Date().toISOString().split('T')[0]}`}
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
                placeholder="Search by reference..."
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

        {isLoading ? (
          <div className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="ml-3 text-muted-foreground">Loading transactions...</p>
            </div>
          </div>
        ) : (
          <>
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
                  Reference
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                {userRole === 'super_admin' && (
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Division
                  </th>
                )}
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(txn.id)}
                      onChange={() => toggleSelectTransaction(txn.id)}
                      className="w-4 h-4 rounded border-input cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {txn.reference}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                      txn.type === 'top_up' ? 'text-success' : 'text-foreground'
                    }`}>
                      {txn.type === 'top_up' ? (
                        <>
                          <ArrowUpCircle className="w-4 h-4" />
                          Top-Up
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          Usage
                        </>
                      )}
                    </span>
                  </td>
                  {userRole === 'super_admin' && (
                    <td className="px-6 py-4 text-sm text-foreground">
                      {txn.division}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(txn.date).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${
                    txn.amount > 0 ? 'text-success' : 'text-foreground'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      txn.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(endIndex, transactions.length)}</span> of{' '}
              <span className="font-medium text-foreground">{transactions.length}</span> transactions
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
        </>
        )}
      </div>

      {/* Top-Up Information Card */}
      {userRole !== 'super_admin' && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">How to Top-Up Your Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To load funds into your {userRole === 'general_insurance' ? 'General Insurance' : 'Asset Management'} account:
          </p>
          <ol className="space-y-2 text-sm text-foreground mb-6">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
              <span>Click the "Request Account Top-Up" button above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">2</span>
              <span>Fill in the amount and submit your top-up request</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">3</span>
              <span>Our team will review and process your request offline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">4</span>
              <span>Once confirmed, funds will be added to your account</span>
            </li>
          </ol>
          <p className="text-xs text-muted-foreground">
            For urgent top-ups or assistance, please contact support at <span className="text-primary font-medium">support@mfstech.co.ke</span>
          </p>
        </div>
      )}

      {/* Super Admin Action Buttons */}
      {userRole === 'super_admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleOpenTopUpModal('General Insurance')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Request Top-Up for General Insurance</span>
          </button>
          <button
            onClick={() => handleOpenTopUpModal('Asset Management')}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Request Top-Up for Asset Management</span>
          </button>
        </div>
      )}

      <RequestTopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onSubmit={handleTopUpRequest}
        division={topUpDivision}
      />

      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
