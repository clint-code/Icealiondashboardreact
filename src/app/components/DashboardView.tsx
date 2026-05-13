import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, FileCheck, DollarSign, Activity, CheckCircle2, ArrowUpCircle, ChevronLeft, ChevronRight, Search, Calendar, Plus, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RequestTopUpModal } from './RequestTopUpModal';
import { Toast } from './Toast';
import { ExportButton } from './ExportButton';

interface DashboardData {
  accountBalance: number;
  utilisedAmount: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  division: 'general_insurance' | 'asset_management' | 'both';
}

interface DashboardViewProps {
  userRole: 'super_admin' | 'general_insurance' | 'asset_management';
}

export function DashboardView({ userRole }: DashboardViewProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('');
  const [topUpDivision, setTopUpDivision] = useState<string | undefined>(undefined);
  const [nextTxnId, setNextTxnId] = useState(6);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingDashboard(true);
      setDashboardError(null);

      try {
        // In production, replace this with actual API call:
        // const response = await fetch(`/api/dashboard/${userRole}`);
        // const data = await response.json();
        // setDashboardData(data);

        // Mock API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data based on userRole
        let mockData: DashboardData;
        if (userRole === 'super_admin') {
          mockData = {
            accountBalance: 1500000,
            utilisedAmount: 565000,
            totalRequests: 2139,
            completedRequests: 1853,
            pendingRequests: 260,
            division: 'both',
          };
        } else if (userRole === 'general_insurance') {
          mockData = {
            accountBalance: 850000,
            utilisedAmount: 320000,
            totalRequests: 1247,
            completedRequests: 1089,
            pendingRequests: 142,
            division: 'general_insurance',
          };
        } else {
          mockData = {
            accountBalance: 650000,
            utilisedAmount: 245000,
            totalRequests: 892,
            completedRequests: 764,
            pendingRequests: 118,
            division: 'asset_management',
          };
        }

        setDashboardData(mockData);
      } catch (err) {
        setDashboardError('Failed to load dashboard dashboardData. Please try again.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [userRole]);

  // Mock recent transactions - In production, fetch from API
  const [allTransactions, setAllTransactions] = useState([
    {
      id: 'TXN001',
      type: 'top_up' as const,
      division: 'General Insurance',
      amount: 500000,
      date: '2026-04-15',
      status: 'completed' as const,
      reference: 'TOPUP-GI-20260415-001',
    },
    {
      id: 'TXN002',
      type: 'usage' as const,
      division: 'General Insurance',
      amount: -45000,
      date: '2026-04-20',
      status: 'completed' as const,
      reference: 'USAGE-GI-20260420-142',
    },
    {
      id: 'TXN003',
      type: 'top_up' as const,
      division: 'Asset Management',
      amount: 400000,
      date: '2026-04-10',
      status: 'completed' as const,
      reference: 'TOPUP-AM-20260410-001',
    },
    {
      id: 'TXN004',
      type: 'usage' as const,
      division: 'Asset Management',
      amount: -32000,
      date: '2026-04-18',
      status: 'completed' as const,
      reference: 'USAGE-AM-20260418-089',
    },
    {
      id: 'TXN005',
      type: 'top_up' as const,
      division: 'Asset Management',
      amount: 300000,
      date: '2026-05-05',
      status: 'pending' as const,
      reference: 'TOPUP-AM-20260505-001',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDivisionLabel = () => {
    if (userRole === 'super_admin') return 'All Divisions';
    if (userRole === 'general_insurance') return 'General Insurance';
    return 'Asset Management';
  };

  const getDivisionName = () => {
    if (userRole === 'general_insurance') return 'General Insurance';
    if (userRole === 'asset_management') return 'Asset Management';
    return undefined;
  };

  const utilizationPercentage = dashboardData ? ((dashboardData.utilisedAmount / dashboardData.accountBalance) * 100).toFixed(1) : '0';
  const completionRate = dashboardData ? ((dashboardData.completedRequests / dashboardData.totalRequests) * 100).toFixed(1) : '0';

  // Account data for super admin
  const generalInsuranceAccount = {
    division: 'General Insurance',
    accountBalance: 850000,
    utilisedAmount: 320000,
    availableBalance: 530000,
  };

  const assetManagementAccount = {
    division: 'Asset Management',
    accountBalance: 650000,
    utilisedAmount: 245000,
    availableBalance: 405000,
  };

  const accounts = userRole === 'super_admin'
    ? [generalInsuranceAccount, assetManagementAccount]
    : [];

  const handleTopUpRequest = (amount: number, notes: string) => {
    // In production, this would send the request to an API
    console.log('Top-up request submitted:', { amount, notes, division: dashboardData?.division });

    // Get division name for the transaction
    const divisionName = topUpDivision || getDivisionName() || 'General Insurance';
    const divisionCode = divisionName === 'General Insurance' ? 'GI' : 'AM';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Create new transaction
    const newTransaction = {
      id: `TXN${String(nextTxnId).padStart(3, '0')}`,
      type: 'top_up' as const,
      division: divisionName,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      reference: `TOPUP-${divisionCode}-${today}-${String(nextTxnId).padStart(3, '0')}`,
    };

    // Add transaction to the list
    setAllTransactions(prev => [newTransaction, ...prev]);
    setNextTxnId(prev => prev + 1);

    setToast({
      message: `Top-up request for KES ${amount.toLocaleString()} has been submitted successfully!`,
      type: 'success',
    });
  };

  // Automatically update pending top-up transactions to completed after 3 seconds
  useEffect(() => {
    const pendingTopUps = allTransactions.filter(
      txn => txn.status === 'pending' && txn.type === 'top_up'
    );

    if (pendingTopUps.length === 0) return;

    const timers = pendingTopUps.map(txn => {
      return setTimeout(() => {
        setAllTransactions(prev =>
          prev.map(t =>
            t.id === txn.id
              ? { ...t, status: 'completed' as const }
              : t
          )
        );

        setToast({
          message: `Top-up of ${formatCurrency(txn.amount)} for ${txn.division} has been approved and completed!`,
          type: 'success',
        });
      }, 3000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [allTransactions]);

  // Filter transactions based on user role
  let filteredTransactions = userRole === 'super_admin'
    ? allTransactions
    : allTransactions.filter(txn => txn.division === getDivisionName());

  // Search filter
  if (searchTerm) {
    filteredTransactions = filteredTransactions.filter(txn =>
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Division filter for super admin
  if (userRole === 'super_admin' && selectedDivisionFilter) {
    const divisionName = selectedDivisionFilter === 'general_insurance' ? 'General Insurance' : 'Asset Management';
    filteredTransactions = filteredTransactions.filter(txn => txn.division === divisionName);
  }

  // Date filter
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(txn => {
      const txnDate = new Date(txn.date);
      return txnDate >= new Date(startDate);
    });
  }

  if (endDate) {
    filteredTransactions = filteredTransactions.filter(txn => {
      const txnDate = new Date(txn.date);
      return txnDate <= new Date(endDate);
    });
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

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
    ? filteredTransactions.filter(txn => selectedTransactions.has(txn.id))
    : filteredTransactions;

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

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
    setSelectedTransactions(new Set());
  };

  // Loading state
  if (isLoadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="ml-4 text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (dashboardError || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
          <p className="text-destructive font-medium mb-2">Failed to Load Dashboard</p>
          <p className="text-sm text-muted-foreground">{dashboardError || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {getDivisionLabel()} • Real-time account metrics and E-KYC statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Account Balance"
          value={formatCurrency(dashboardData.accountBalance)}
          subtitle="Prepaid balance available"
          icon={Wallet}
          iconBgColor="bg-primary/10"
        />

        <StatsCard
          title="Utilised Amount"
          value={formatCurrency(dashboardData.utilisedAmount)}
          subtitle={`${utilizationPercentage}% of total balance`}
          icon={TrendingUp}
          trend={{ value: '12.5%', isPositive: true }}
          iconBgColor="bg-[#AFCB09]/10"
        />

        <StatsCard
          title="Total E-KYC Requests"
          value={dashboardData.totalRequests.toString()}
          subtitle="This month"
          icon={FileCheck}
          trend={{ value: '8.2%', isPositive: true }}
          iconBgColor="bg-info/10"
        />

        <StatsCard
          title="Completed Requests"
          value={dashboardData.completedRequests.toString()}
          subtitle={`${completionRate}% completion rate`}
          icon={CheckCircle2}
          iconBgColor="bg-success/10"
        />

        <StatsCard
          title="Failed Requests"
          value={(dashboardData.totalRequests - dashboardData.completedRequests - dashboardData.pendingRequests).toString()}
          subtitle="Requires attention"
          icon={Activity}
          iconBgColor="bg-destructive/10"
        />

        <StatsCard
          title="Average Cost Per Request"
          value={formatCurrency(dashboardData.utilisedAmount / dashboardData.totalRequests)}
          subtitle="Based on utilised amount"
          icon={DollarSign}
          iconBgColor="bg-primary/10"
        />
      </div>

      {/* Division-Specific Account Cards - Only for Super Admin */}
      {userRole === 'super_admin' && (
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
                <div>
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Utilised Amount</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(account.utilisedAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Super Admin Action Buttons */}
      {userRole === 'super_admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setTopUpDivision('General Insurance');
              setIsTopUpModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Request Top-Up for General Insurance</span>
          </button>
          <button
            onClick={() => {
              setTopUpDivision('Asset Management');
              setIsTopUpModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Request Top-Up for Asset Management</span>
          </button>
        </div>
      )}

      {/* Transaction History - For Super Admin and Division Users */}
      {(userRole === 'super_admin' || userRole !== 'super_admin') && (
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
                  onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                  placeholder="Search by reference..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {userRole === 'super_admin' && (
                <div className="relative min-w-[200px]">
                  <select
                    value={selectedDivisionFilter}
                    onChange={(e) => handleFilterChange(() => setSelectedDivisionFilter(e.target.value))}
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
                  onChange={(e) => handleFilterChange(() => setStartDate(e.target.value))}
                  placeholder="Start Date"
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="relative min-w-[160px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleFilterChange(() => setEndDate(e.target.value))}
                  placeholder="End Date"
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
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
                <span className="font-medium text-foreground">{Math.min(endIndex, filteredTransactions.length)}</span> of{' '}
                <span className="font-medium text-foreground">{filteredTransactions.length}</span> transactions
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
      )}

      {/* Request Top-Up Button - Only for General Insurance and Asset Management */}
      {userRole !== 'super_admin' && (
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Need to Top-Up Your Account?</h3>
              <p className="text-sm text-white/90">
                Contact our team to load more funds and continue your E-KYC verification services
              </p>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="px-6 py-3 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors font-medium shadow-md"
            >
              Request Top-Up
            </button>
          </div>
        </div>
      )}

      {/* How to Top-Up Your Account - Only for General Insurance and Asset Management */}
      {userRole !== 'super_admin' && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">How to Top-Up Your Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To load funds into your {getDivisionName()} account:
          </p>
          <ol className="space-y-2 text-sm text-foreground mb-6">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
              <span>Click the "Request Top-Up" button above</span>
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

      <RequestTopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => {
          setIsTopUpModalOpen(false);
          setTopUpDivision(undefined);
        }}
        onSubmit={handleTopUpRequest}
        division={topUpDivision || getDivisionName()}
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
