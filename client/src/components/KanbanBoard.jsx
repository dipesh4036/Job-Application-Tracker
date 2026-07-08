import { useState } from "react";
import StatusBadge from "./StatusBadge";
import LocationBadge from "./LocationBadge";
import ConfirmDialog from "./ConfirmDialog";
import {
  formatDate,
  isOverdue,
  isStatusTransitionDisabled,
} from "../utils/formatters";
import { STATUSES } from "../validations/applicationSchemas";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, AlertTriangle, GripVertical } from "lucide-react";
import { toast, useSonner } from "sonner";

const KanbanBoard = ({ applications, onEdit, onDelete, onStatusChange }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const handleDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  // Drag handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setActiveColumn(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setActiveColumn(status);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveColumn(null);
    const id = e.dataTransfer.getData("text/plain") || draggedId;
    if (!id) return;

    const app = applications.find((a) => a.id === id);
    if (!app) return;

    if (app.status === targetStatus) return;

    if (isStatusTransitionDisabled(app.status, targetStatus)) {
      toast.error(
        `Invalid status progression from "${app.status}" to "${targetStatus}"`,
      );
      return;
    }

    try {
      await onStatusChange(id, targetStatus);
    } catch (error) {
      useSonner.error("Failed to update application status");
    }
  };

  return (
    <>
      <div className="flex overflow-x-auto gap-4 items-start pb-4 scrollbar-thin snap-x snap-mandatory">
        {STATUSES.map((status) => {
          const columnApps = applications.filter(
            (app) => app.status === status,
          );
          const isOver = activeColumn === status;

          return (
            <div
              key={status}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
              className={`min-w-[280px] w-full lg:w-1/5 snap-align-start shrink-0 rounded-2xl border p-3 flex flex-col min-h-[450px] transition-all duration-200 ${
                isOver
                  ? "bg-indigo-50/40 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800 ring-2 ring-indigo-500/10"
                  : "bg-muted/10 border-muted/80 dark:bg-slate-900/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <StatusBadge status={status} />
                <span className="text-xs font-semibold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                  {columnApps.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
                {columnApps.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-8 rounded-xl border border-dashed border-muted/50 text-center">
                    <p className="text-xs text-muted-foreground px-2">
                      Drag here
                    </p>
                  </div>
                ) : (
                  columnApps.map((app) => {
                    const overdue = isOverdue(app.next_follow_up_date);
                    const isDragged = draggedId === app.id;

                    return (
                      <div
                        key={app.id}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-xl border bg-card p-3.5 shadow-sm hover:shadow-md hover:border-muted transition-all duration-200 relative cursor-grab active:cursor-grabbing ${
                          isDragged ? "opacity-40 scale-95" : ""
                        } ${
                          overdue
                            ? "border-l-4 border-l-amber-500 bg-amber-500/5"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <div>
                            <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
                              {app.company}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {app.role}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 hover:bg-muted"
                              onClick={() => onEdit(app)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                              onClick={() => setDeleteTarget(app.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3.5 gap-2">
                          <LocationBadge location={app.location} />
                          <div className="flex flex-col items-end text-[10px] text-muted-foreground">
                            <span>Applied: {formatDate(app.applied_date)}</span>
                            {app.next_follow_up_date && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {overdue && (
                                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                                )}
                                <span
                                  className={
                                    overdue ? "text-amber-600 font-medium" : ""
                                  }
                                >
                                  Follow-up:{" "}
                                  {formatDate(app.next_follow_up_date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Application"
        description="Are you sure you want to delete this job application? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default KanbanBoard;
