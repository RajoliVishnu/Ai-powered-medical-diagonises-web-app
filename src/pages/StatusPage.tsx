import { useEffect, useState } from 'react';

interface HealthResponse {
  ok: boolean;
  service?: string;
  version?: string;
  [key: string]: unknown;
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchHealth() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health', { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as HealthResponse;
      setHealth(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">System Status</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Backend Health</h2>
            <p className="text-sm text-gray-500">GET /api/health</p>
          </div>
          <button
            onClick={fetchHealth}
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Checking…' : 'Refresh'}
          </button>
        </div>
        <div className="mt-4">
          {error && (
            <div className="text-red-600">Error: {error}</div>
          )}
          {!error && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-3 w-3 rounded-full ${health?.ok ? 'bg-green-500' : 'bg-yellow-500'}`}
                aria-label={health?.ok ? 'healthy' : 'unknown'}
              />
              <span className="text-sm text-gray-700">
                {health ? (health.ok ? 'Healthy' : 'Degraded/Unknown') : 'No data yet'}
              </span>
            </div>
          )}
          <pre className="mt-3 text-sm bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">
{JSON.stringify(health ?? { message: error ?? 'fetching…' }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Tip: Ensure the backend is running on http://localhost:5000.
      </div>
    </div>
  );
}

