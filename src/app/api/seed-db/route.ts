import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-new-db';

export async function POST(request: Request) {
    try {
        console.log('🌱 Seed endpoint called');
        await seedDatabase();

        return NextResponse.json(
            {
                success: true,
                message: '✅ Database seeded successfully!',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Seeding error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                message: 'Error during seeding',
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    return NextResponse.json({
        message: 'Seed endpoint ready',
        instructions: 'Send POST request to seed the database',
    });
}
