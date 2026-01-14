"use client";

import { useState } from "react";
import { Button } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function BatchImportTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [limit, setLimit] = useState<number>(5);

  const runBatchImport = async (importLimit?: number) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/stays/batch-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          host_id: 25,
          status: "draft",
          limit: importLimit ?? limit,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, data });
      } else {
        setResult({ success: false, error: data });
      }
    } catch (error: any) {
      setResult({ success: false, error: { message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Batch Import Listings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test with limit (default: 5):
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
            className="border rounded px-3 py-2 w-32"
            min="1"
            max="98"
          />
          <p className="text-sm text-gray-500 mt-1">
            Total listings available: 98
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => runBatchImport(limit)}
            loading={loading}
            size="large"
          >
            Test Import ({limit} listings)
          </Button>
          <Button
            type="default"
            icon={<PlayCircleOutlined />}
            onClick={() => runBatchImport(98)}
            loading={loading}
            size="large"
          >
            Import All (98 listings)
          </Button>
        </div>

        {result && (
          <div className="mt-6">
            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleOutlined className="text-green-600 text-xl" />
                  <h2 className="text-lg font-semibold text-green-800">
                    Import Completed!
                  </h2>
                </div>

                {result.data?.summary && (
                  <div className="space-y-2 mb-4">
                    <p>
                      <strong>Total:</strong> {result.data.summary.total}
                    </p>
                    <p className="text-green-700">
                      <strong>Successful:</strong> {result.data.summary.successful}
                    </p>
                    {result.data.summary.failed > 0 && (
                      <p className="text-red-600">
                        <strong>Failed:</strong> {result.data.summary.failed}
                      </p>
                    )}
                  </div>
                )}

                {result.data?.errors && result.data.errors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Errors:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.data.errors.slice(0, 10).map((err: any, i: number) => (
                        <li key={i} className="text-red-700">
                          {err.title} (ID: {err.original_id}): {err.error}
                        </li>
                      ))}
                      {result.data.errors.length > 10 && (
                        <li className="text-gray-500">
                          ... and {result.data.errors.length - 10} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {result.data?.results && result.data.results.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Successful Imports:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm max-h-60 overflow-y-auto">
                      {result.data.results.slice(0, 20).map((r: any, i: number) => (
                        <li key={i} className="text-green-700">
                          {r.title} (Old: {r.original_id}, New: {r.new_id || "N/A"})
                        </li>
                      ))}
                      {result.data.results.length > 20 && (
                        <li className="text-gray-500">
                          ... and {result.data.results.length - 20} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CloseCircleOutlined className="text-red-600 text-xl" />
                  <h2 className="text-lg font-semibold text-red-800">Import Failed</h2>
                </div>
                <p className="text-red-700">
                  {result.error?.message || "Unknown error occurred"}
                </p>
                {result.error?.error && (
                  <p className="text-sm text-red-600 mt-2">
                    {result.error.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




