
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import FlightResultsClient from '@/components/features/flight/flight-results-client'
import { getAllFlights, getFilteredFlights } from '@/lib/data'

type Props = {
  searchParams: Promise<{
    origin?: string
    destination?: string
    from?: string // Date
    guests?: string
  }>
}

export default async function FlightResultsPage({ searchParams }: Props) {
  const { origin, destination, from: date, guests } = await searchParams

  // We can fetch initial data here server-side if we want, or let the client handling IT.
  // Given existing client component structure, we'll pass params to it.

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-foreground">
      <Header />

      <main className="flex-1 pt-24 pb-12 relative overflow-hidden">
        {/* Animated Gradient Orbs Background */}
        <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="glass-card rounded-2xl p-6 mb-8 border-slate-200/50 dark:border-slate-800/50">
            <h2 className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
              Flights {origin ? `from ${origin}` : ''} {destination ? `to ${destination}` : ''}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Found optimal connections for your trip</p>
          </div>

          <div className="lg:grid lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <div className="glass-card rounded-2xl p-6 sticky top-28 border-slate-200/50 dark:border-slate-800/50">
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span> Filters
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Stops</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-primary transition-colors">
                          <input type="checkbox" className="hidden" />
                          <div className="w-3 h-3 bg-primary rounded-sm opacity-0 check-indicator"></div>
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Non Stop</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-primary transition-colors">
                          <input type="checkbox" className="hidden" />
                          <div className="w-3 h-3 bg-primary rounded-sm opacity-0 check-indicator"></div>
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">1 Stop</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-slate-700/50"></div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Price Range</h4>
                    <input type="range" min={0} max={10000} className="w-full accent-primary h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9">
              {/* Results list (client) which handles fetching/displaying */}
              <FlightResultsClient
                initialOrigin={origin}
                initialDestination={destination}
                initialDate={date}
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
