import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, Loader2 } from 'lucide-react';

interface AccountEntry {
  account: string;
  entryType: 'CREDIT' | 'DEBIT';
  chargeType: string;
  amount: number;
}

export function ViewChargesPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chargeDetails = {
    channelReference: `${requestId}-PGW24`,
    walletReference: `1E0557674596501QDU6kWALREF${requestId?.slice(-14)}`,
    idNo: '27905634',
  };

  const accountBalances = {
    openingBalance: 2718,
    closingBalance: 2689,
    cost: 29,
  };

  useEffect(() => {
    const fetchAccountEntries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, replace this with actual API call:
        // const response = await fetch(`/api/charges/${requestId}/entries`);
        // const data = await response.json();
        // setAccountEntries(data.accountEntries);

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockData: AccountEntry[] = [
          {
            account: '2106250000001',
            entryType: 'CREDIT',
            chargeType: 'IPRS_Q',
            amount: 5,
          },
          {
            account: '2106250000001',
            entryType: 'CREDIT',
            chargeType: 'ICEA_IPRS',
            amount: 23,
          },
          {
            account: '2410180000032',
            entryType: 'DEBIT',
            chargeType: 'CHARGE_LOADED',
            amount: 28,
          },
          {
            account: '2410180000032',
            entryType: 'DEBIT',
            chargeType: 'TRANSFER',
            amount: 1,
          },
          {
            account: '2106250000003',
            entryType: 'CREDIT',
            chargeType: 'TRANSFER',
            amount: 1,
          },
        ];

        setAccountEntries(mockData);
      } catch (err) {
        setError('Failed to load account entries. Please try again.');
        console.error('Error fetching account entries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountEntries();
  }, [requestId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/ekyc-requests/${requestId}`)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Search Request Log Charge</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Detailed charge breakdown for request
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/ekyc-requests/${requestId}`)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Request</label>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-mono text-foreground">{requestId}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Charge Transaction Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Channel Reference
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-mono text-foreground">{chargeDetails.channelReference}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Wallet Reference
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-mono text-foreground">{chargeDetails.walletReference}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                id_no
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-mono text-foreground">{chargeDetails.idNo}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Entries</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="ml-3 text-sm text-muted-foreground">Loading account entries...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : accountEntries.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground">No account entries found for this request.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                      Account
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                      Entry Type
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                      Charge Type
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accountEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">
                        {entry.account}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          entry.entryType === 'CREDIT'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {entry.chargeType}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                        {entry.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Opening Balance
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-semibold text-foreground">
                  KES {accountBalances.openingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Closing Balance
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-semibold text-foreground">
                  KES {accountBalances.closingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Cost
              </label>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-2xl font-semibold text-primary">
                  KES {accountBalances.cost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
