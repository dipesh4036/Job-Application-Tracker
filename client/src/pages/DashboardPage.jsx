import { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import StatsPanel from "../components/StatsPanel";
import SearchInput from "../components/SearchInput";
import StatusFilter from "../components/StatusFilter";
import ApplicationList from "../components/ApplicationList";
import ApplicationModal from "../components/ApplicationModal";
import { useApplications } from "../hooks/useApplications";
import { useDebounce } from "../hooks/useDebounce";
import { getStats, getApplications } from "../services/applicationService";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import { toast } from "sonner";

const DashboardPage = () => {
  const {
    applications,
    fetchApplications,
    addApplication,
    editApplication,
    changeStatus,
    removeApplication,
  } = useApplications();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [modalSubmitLoading, setModalSubmitLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("applied_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'kanban'

  const debouncedSearch = useDebounce(search, 300);

  // Fetch stats separately
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch applications list whenever filters, search term, page, sorting, or view mode updates
  const loadData = useCallback(async () => {
    const isKanban = viewMode === "kanban";
    const params = {
      page: isKanban ? 1 : page,
      limit: isKanban ? 1000 : 10,
      sort: sortField,
      order: sortOrder,
    };
    if (debouncedSearch.trim() !== "") {
      params.search = debouncedSearch.trim();
    }
    if (status !== "all") {
      params.status = status;
    }
    const pagination = await fetchApplications(params);
    if (pagination && !isKanban) {
      setTotalPages(pagination.pages);
    }
  }, [
    debouncedSearch,
    status,
    page,
    sortField,
    sortOrder,
    viewMode,
    fetchApplications,
  ]);

  // Reset to page 1 when search or status filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Export applications to CSV
  const handleExportCSV = async () => {
    try {
      const params = { limit: 10000, sort: sortField, order: sortOrder };
      if (debouncedSearch.trim() !== "") {
        params.search = debouncedSearch.trim();
      }
      if (status !== "all") {
        params.status = status;
      }
      const response = await getApplications(params);
      const allApps = response.data.applications;

      if (!allApps || allApps.length === 0) {
        toast.error("No applications to export");
        return;
      }

      const headers = [
        "Company",
        "Role",
        "Location",
        "Status",
        "Applied Date",
        "Follow-Up Date",
        "Salary",
        "Notes",
      ];
      const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
      const rows = allApps.map((app) => [
        escape(app.company),
        escape(app.role),
        escape(app.location),
        escape(app.status),
        escape(app.applied_date?.split("T")[0]),
        escape(app.next_follow_up_date?.split("T")[0]),
        escape(app.salary_expectation),
        escape(app.notes),
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n",
      );
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export CSV");
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
    fetchStats();
  }, [loadData, fetchStats]);

  const handleCreateOrUpdate = async (data) => {
    setModalSubmitLoading(true);
    try {
      if (editingApp) {
        await editApplication(editingApp.id, data);
      } else {
        await addApplication(data);
      }
      loadData();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      throw error;
    } finally {
      setModalSubmitLoading(false);
    }
  };

  const handleInlineStatusChange = async (id, newStatus) => {
    try {
      await changeStatus(id, newStatus);
      loadData();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeApplication(id);
      loadData();
      fetchStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete application",
      );
    }
  };

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Applications Dashboard
            </h2>
            <p className="text-muted-foreground">
              Monitor and manage your active job application pipelines.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                loadData();
                fetchStats();
                toast.success("Dashboard refreshed");
              }}
              disabled={statsLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${statsLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExportCSV}
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Application
            </Button>
          </div>
        </div>

        <StatsPanel stats={stats} />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-muted/80">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <SearchInput value={search} onChange={setSearch} />
              <StatusFilter value={status} onChange={setStatus} />
            </div>

            <div className="hidden md:flex items-center border rounded-lg bg-card p-1 shadow-sm shrink-0">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 gap-1.5 px-3 rounded-md"
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="h-8 gap-1.5 px-3 rounded-md"
              >
                <LayoutGrid className="w-4 h-4" />
                Board
              </Button>
            </div>
          </div>

          {viewMode === "list" ? (
            <>
              <ApplicationList
                applications={applications}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                onStatusChange={handleInlineStatusChange}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-muted/80 pt-4 px-1">
                  <p className="text-sm text-muted-foreground">
                    Page <span className="font-semibold">{page}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="hidden md:block">
                <KanbanBoard
                  applications={applications}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleInlineStatusChange}
                />
              </div>
              <div className="block md:hidden">
                <ApplicationList
                  applications={applications}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleInlineStatusChange}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <ApplicationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleCreateOrUpdate}
        application={editingApp}
        loading={modalSubmitLoading}
      />
    </div>
  );
};

export default DashboardPage;
