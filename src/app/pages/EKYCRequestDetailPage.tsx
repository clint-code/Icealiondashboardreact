import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Download, ChevronLeft, FileText, Loader2 } from 'lucide-react';

interface EKYCRequest {
  id: string;
  createdAt: string;
  requestSource: string;
  searchData: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  division: 'general_insurance' | 'asset_management';
}

export function EKYCRequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<EKYCRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, replace with actual API call:
        // const response = await fetch(`/api/ekyc-requests/${requestId}`);
        // const data = await response.json();
        // setRequest(data.request);

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockRequest: EKYCRequest = {
          id: requestId || '',
          createdAt: '06/05/2026 13:39:30',
          requestSource: 'IPRS_Q',
          searchData: '13484018',
          reference: 'bcd5a9b-152f-4a20-9f6a-80e76746465f',
          status: 'completed',
          division: 'general_insurance',
        };

        setRequest(mockRequest);
      } catch (err) {
        setError('Failed to load request details. Please try again.');
        console.error('Error fetching request details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-lg text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-border shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
            <p className="text-destructive font-medium mb-2">Failed to Load Request</p>
            <p className="text-sm text-muted-foreground">{error || 'Request not found'}</p>
          </div>
          <button
            onClick={() => navigate('/ekyc-requests')}
            className="w-full h-11 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
          >
            Back to E-KYC Requests
          </button>
        </div>
      </div>
    );
  }

  const requestParameters = {
    idType: '1',
    number: request.searchData,
  };

  const results = {
    status: request.status.toUpperCase(),
  };

  const resultsResponse = {
    StatusCode: '1',
    Status: 'Success',
    ResponseCode: '200',
    Response: 'OK',
    UniqueNumber: request.searchData,
    IdNumber: request.searchData,
    Surname: 'KAMAU',
    OtherNames: 'JOHN MWANGI',
    DateOfBirth: '15th January 1985',
    Gender: 'M',
    District: 'NAIROBI',
    PlaceOfBirth: 'NAIROBI',
    Citizenship: 'KENYAN',
    Clan: 'N/A',
    FamilyID: 'N/A',
    DateOfDeath: 'N/A',
    SerialNumber: '123456789012',
    Fingerprint: 'CAPTURED',
    Photo: 'CAPTURED',
    Signature: 'CAPTURED',
    DateOfIssue: '1st March 2020',
    PlaceOfIssue: 'NAIROBI',
    Timestamp: new Date().toISOString(),
    RequestID: request.reference,
    QueryTimestamp: request.createdAt,
  };

  const handleDownload = () => {
    const reportData = {
      Request: {
        ID: request.id,
        Reference: request.reference,
        Source: request.requestSource,
        CreatedAt: request.createdAt,
        Status: request.status,
      },
      Parameters: requestParameters,
      Results: results,
      DetailedResponse: resultsResponse,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EKYC-Report-${request.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/ekyc-requests')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">E-KYC Request Details</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Request: {request.reference}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/ekyc-requests')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Request Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Request ID</p>
              <p className="text-sm font-medium text-foreground">{request.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reference</p>
              <p className="text-sm font-medium text-foreground font-mono">{request.reference}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created On</p>
              <p className="text-sm font-medium text-foreground">{request.createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Request Source</p>
              <p className="text-sm font-medium text-foreground">{request.requestSource}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Division</p>
              <p className="text-sm font-medium text-foreground">
                {request.division === 'general_insurance' ? 'General Insurance' : 'Asset Management'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                request.status === 'completed' ? 'bg-success/10 text-success' :
                request.status === 'pending' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Request Parameters</h2>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="flex">
                <span className="text-muted-foreground w-32">ID Type:</span>
                <span className="text-foreground">{requestParameters.idType}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-32">Number:</span>
                <span className="text-foreground">{requestParameters.number}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Results</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className="text-2xl font-semibold text-foreground">{results.status}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Results Response</h2>
          <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words">
{JSON.stringify(resultsResponse, null, 2)}
            </pre>
          </div>
        </div>

        {request.status === 'completed' && (
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID Number</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.IdNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Surname</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.Surname}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Other Names</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.OtherNames}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.DateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.Gender === 'M' ? 'Male' : 'Female'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Citizenship</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.Citizenship}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">District</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.District}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Place of Birth</p>
                <p className="text-sm font-medium text-foreground">{resultsResponse.PlaceOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Serial Number</p>
                <p className="text-sm font-medium text-foreground font-mono">{resultsResponse.SerialNumber}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Biometric Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fingerprint</p>
                    <p className="text-sm font-medium text-foreground">{resultsResponse.Fingerprint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Photo</p>
                    <p className="text-sm font-medium text-foreground">{resultsResponse.Photo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signature</p>
                    <p className="text-sm font-medium text-foreground">{resultsResponse.Signature}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 pb-6">
          <button
            onClick={() => navigate(`/ekyc-requests/${request.id}/charges`)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-md font-medium"
          >
            <FileText className="w-5 h-5" />
            View Charges
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
