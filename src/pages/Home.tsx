import StatCard from '../components/common/Cards/StatCard';
import ProductionCard from '../components/common/Cards/ProductionCard';
import InventoryCard from '../components/common/Cards/InventoryCard';
import ActivityChart from '../components/common/Cards/ActivityChart';
import WorkerList from '../components/common/Cards/WorkerList';
import TaskList from '../components/common/Cards/TaskList';
import WeatherWidget from '../components/common/Cards/WeatherWidget';
import {
  useDashboardMetrics,
  useProductionSummary,
  useInventory,
  useActivities,
  useWorkers,
  useTasks,
  useWeather,
} from '../hooks/useDashboard';

export default function Home() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: production, isLoading: productionLoading } = useProductionSummary();
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: weather, isLoading: weatherLoading } = useWeather();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Finca</h1>
        <p className="text-gray-600 mt-2">Vista general de tu finca</p>
      </div>

      {/* Metrics Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metricsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 h-32 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : (
          metrics?.map((metric, index) => (
            <StatCard key={index} metric={metric} />
          ))
        )}
      </div>

      {/* Main Content Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Production & Inventory */}
        <div className="space-y-6">
          {productionLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : production ? (
            <ProductionCard production={production} />
          ) : null}

          {inventoryLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : inventory ? (
            <InventoryCard items={inventory} />
          ) : null}
        </div>

        {/* Middle Column - Activities & Workers */}
        <div className="space-y-6">
          {activitiesLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-80 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : activities ? (
            <ActivityChart activities={activities} />
          ) : null}

          {workersLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : workers ? (
            <WorkerList workers={workers} />
          ) : null}
        </div>

        {/* Right Column - Tasks & Weather */}
        <div className="space-y-6">
          {tasksLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-80 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : tasks ? (
            <TaskList tasks={tasks} />
          ) : null}

          {weatherLoading ? (
            <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ) : weather ? (
            <WeatherWidget weather={weather} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
