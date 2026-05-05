'use client';

import { useState } from 'react';

export default function SeedDBPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        timestamp?: string;
    } | null>(null);

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/seed-db', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                console.log('✅ Database seeded successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
            setResult({
                success: false,
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    🗄️ Seed Database
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Populate your new Firebase database with sample data
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-blue-900 mb-2">📋 This will add:</h2>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>3 Sample Users</li>
                        <li>3 Hotels with Reviews</li>
                        <li>3 Rooms</li>
                        <li>2 Buses</li>
                        <li>2 Trains</li>
                        <li>2 Flights</li>
                    </ul>
                </div>

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Seeding in progress...
                        </span>
                    ) : (
                        '🌱 Seed Database'
                    )}
                </button>

                {result && (
                    <div
                        className={`mt-6 p-4 rounded-lg border ${
                            result.success
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}
                    >
                        <p
                            className={`font-semibold ${
                                result.success ? 'text-green-900' : 'text-red-900'
                            }`}
                        >
                            {result.success ? '✅' : '❌'} {result.message}
                        </p>
                        {result.timestamp && (
                            <p className="text-sm text-gray-600 mt-2">
                                {new Date(result.timestamp).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3">📚 Next Steps:</h3>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Verify data in Firebase Console</li>
                        <li>Update security rules if needed</li>
                        <li>Start using your app!</li>
                    </ol>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Firebase Console: <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.firebase.google.com</a></p>
                </div>
            </div>
        </div>
    );
}
