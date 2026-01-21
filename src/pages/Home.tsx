import StatCard from '../components/common/Cards/StatCard';
import ProductionCard from '../components/common/Cards/ProductionCard';
import InventoryCard from '../components/common/Cards/InventoryCard';
import ActivityChart from '../components/common/Cards/ActivityChart';
import WorkerList from '../components/common/Cards/WorkerList';
import TaskList from '../components/common/Cards/TaskList';
import WeatherWidget from '../components/common/Cards/WeatherWidget';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ProductionCardSkeleton from '../components/common/Skeletons/ProductionCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
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
              <StatCardSkeleton key={i} />
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
            <ProductionCardSkeleton />
          ) : production ? (
            <ProductionCard production={production} />
          ) : null}

          {inventoryLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : inventory ? (
            <InventoryCard items={inventory} />
          ) : null}
        </div>

        {/* Middle Column - Activities & Workers */}
        <div className="space-y-6">
          {activitiesLoading ? (
            <ChartSkeleton />
          ) : activities ? (
            <ActivityChart activities={activities} />
          ) : null}

          {workersLoading ? (
            <ListCardSkeleton itemCount={3} showAvatar={true} />
          ) : workers ? (
            <WorkerList workers={workers} />
          ) : null}
        </div>

        {/* Right Column - Tasks & Weather */}
        <div className="space-y-6">
          {tasksLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : tasks ? (
            <TaskList tasks={tasks} />
          ) : null}

          {weatherLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : weather ? (
            <WeatherWidget weather={weather} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
