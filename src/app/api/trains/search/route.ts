import { NextRequest, NextResponse } from 'next/server';
import { searchTrains, isAPIConfigured } from '@/lib/railway-api';
import { transformAPIResponseToTrain } from '@/lib/railway-transformers';
import { getFilteredTrains } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const from = searchParams.get('from') || '';
        const to = searchParams.get('to') || '';
        const date = searchParams.get('date') || '';

        if (!from || !to) {
            return NextResponse.json(
                { error: 'From and To parameters are required' },
                { status: 400 }
            );
        }

        let trains;
        let source = 'firestore';

        if (isAPIConfigured()) {
            try {
                const apiResponse = await searchTrains({ from, to, date });
                trains = transformAPIResponseToTrain(apiResponse);
                source = 'api';
            } catch (apiError: any) {
                trains = await getFilteredTrains(from, to, date);
            }
        } else {
            // Use Firestore data directly
            trains = await getFilteredTrains(from, to, date);
        }

        return NextResponse.json({
            data: trains,
            source,
            count: trains.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Error searching trains:', error);

        return NextResponse.json(
            {
                error: 'Failed to search trains',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
