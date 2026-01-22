import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  InfraestructuraStatCard,
  FacilityCard,
  EquipmentCard,
  MaintenanceList,
  MaintenanceTimelineChart,
  EquipmentStatusChart,
  ActivityList,
  FacilityFormModal,
  FacilityDetailModal,
  EquipmentFormModal,
  EquipmentDetailModal,
} from '../components/infraestructura';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useFacilities,
  useEquipment,
  useMaintenanceRecords,
  useInfraestructuraStats,
  useEquipmentByStatus,
  useMaintenanceTimeline,
  useInfrastructureActivity,
} from '../hooks/useInfraestructura';
import type { Facility, Equipment } from '../types/infraestructura.types';

export default function Infraestructura() {
  // Facility modal state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [facilityFormOpen, setFacilityFormOpen] = useState(false);
  const [facilityDetailOpen, setFacilityDetailOpen] = useState(false);

  // Equipment modal state
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentFormOpen, setEquipmentFormOpen] = useState(false);
  const [equipmentDetailOpen, setEquipmentDetailOpen] = useState(false);

  // Facility handlers
  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setFacilityDetailOpen(true);
  };

  const handleFacilityEdit = (facility: Facility) => {
    setSelectedFacility(facility);
    setFacilityDetailOpen(false);
    setFacilityFormOpen(true);
  };

  const handleNewFacility = () => {
    setSelectedFacility(null);
    setFacilityFormOpen(true);
  };

  // Equipment handlers
  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentDetailOpen(true);
  };

  const handleEquipmentEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentDetailOpen(false);
    setEquipmentFormOpen(true);
  };

  const handleNewEquipment = () => {
    setSelectedEquipment(null);
    setEquipmentFormOpen(true);
  };

  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();
  const { data: equipment, isLoading: equipmentLoading } = useEquipment();
  const { data: maintenance, isLoading: maintenanceLoading } = useMaintenanceRecords();
  const { data: stats, isLoading: statsLoading } = useInfraestructuraStats();
  const { data: equipmentStatus, isLoading: equipmentStatusLoading } = useEquipmentByStatus();
  const { data: timeline, isLoading: timelineLoading } = useMaintenanceTimeline();
  const { data: activity, isLoading: activityLoading } = useInfrastructureActivity();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Infraestructura
        </h1>
        <p className="text-sm text-gray-600">
          Control de instalaciones, equipamiento y mantenimiento de la finca
        </p>
      </div>

      {/* Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : stats ? (
          <>
            <InfraestructuraStatCard
              label="Instalaciones"
              value={stats.totalFacilities}
              icon="facilities"
              subValue={`${stats.operationalFacilities} operativas`}
            />
            <InfraestructuraStatCard
              label="Equipos"
              value={stats.totalEquipment}
              icon="equipment"
              subValue={`${stats.operationalEquipment} operativos`}
            />
            <InfraestructuraStatCard
              label="Mantenimientos"
              value={stats.pendingMaintenances}
              icon="maintenance"
              subValue="pendientes"
            />
            <InfraestructuraStatCard
              label="En Reparación"
              value={stats.equipmentInRepair + stats.facilitiesInMaintenance}
              icon="alerts"
              subValue="equipos/instalaciones"
            />
          </>
        ) : null}
      </div>

      {/* Facilities Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Instalaciones</h2>
          <button
            onClick={handleNewFacility}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Instalación
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {facilitiesLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : facilities ? (
            facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onClick={() => handleFacilityClick(facility)}
              />
            ))
          ) : null}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Maintenance Timeline - takes 2/3 */}
        <div className="lg:col-span-2">
          {timelineLoading ? (
            <ChartSkeleton />
          ) : timeline ? (
            <MaintenanceTimelineChart data={timeline} />
          ) : null}
        </div>

        {/* Equipment Status - takes 1/3 */}
        <div>
          {equipmentStatusLoading ? (
            <ChartSkeleton />
          ) : equipmentStatus ? (
            <EquipmentStatusChart data={equipmentStatus} />
          ) : null}
        </div>
      </div>

      {/* Equipment Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Equipamiento</h2>
          <button
            onClick={handleNewEquipment}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Equipo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {equipmentLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : equipment ? (
            equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onClick={() => handleEquipmentClick(item)}
              />
            ))
          ) : null}
        </div>
      </div>

      {/* Maintenance and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Maintenance List - takes 2/3 */}
        <div className="lg:col-span-2">
          {maintenanceLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : maintenance ? (
            <MaintenanceList records={maintenance} />
          ) : null}
        </div>

        {/* Activity - takes 1/3 */}
        <div>
          {activityLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : activity ? (
            <ActivityList activities={activity} />
          ) : null}
        </div>
      </div>

      {/* Facility Modals */}
      <FacilityFormModal
        open={facilityFormOpen}
        onOpenChange={setFacilityFormOpen}
        facility={selectedFacility}
        onSuccess={() => setSelectedFacility(null)}
      />
      <FacilityDetailModal
        open={facilityDetailOpen}
        onOpenChange={setFacilityDetailOpen}
        facility={selectedFacility}
        onEdit={handleFacilityEdit}
        onDeleteSuccess={() => setSelectedFacility(null)}
      />

      {/* Equipment Modals */}
      <EquipmentFormModal
        open={equipmentFormOpen}
        onOpenChange={setEquipmentFormOpen}
        equipment={selectedEquipment}
        onSuccess={() => setSelectedEquipment(null)}
      />
      <EquipmentDetailModal
        open={equipmentDetailOpen}
        onOpenChange={setEquipmentDetailOpen}
        equipment={selectedEquipment}
        onEdit={handleEquipmentEdit}
        onDeleteSuccess={() => setSelectedEquipment(null)}
      />
    </div>
  );
}
