import { useState } from "react";
import StatusBadge from "./StatusBadge";
import LocationBadge from "./LocationBadge";
import ConfirmDialog from "./ConfirmDialog";
import EmptyState from "./EmptyState";
import {
  formatDate,
  isOverdue,
  isStatusTransitionDisabled,
} from "../utils/formatters";
import { STATUSES } from "../validations/applicationSchemas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

const ApplicationList = ({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
  sortField,
  sortOrder,
  onSort,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!applications || applications.length === 0) {
    return <EmptyState />;
  }

  const handleDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const renderHeader = (label, field, sortable = true) => {
    if (!sortable) {
      return (
        <TableHead className="font-semibold py-2 px-4 sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
          {label}
        </TableHead>
      );
    }
    const isSorted = sortField === field;
    return (
      <TableHead
        className="font-semibold py-2 px-4 sticky top-0 bg-muted/95 backdrop-blur-sm z-10 cursor-pointer select-none hover:text-foreground transition-colors group"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1.5">
          {label}
          {isSorted ? (
            sortOrder === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-80 transition-opacity" />
          )}
        </div>
      </TableHead>
    );
  };

  return (
    <>
      <div className="hidden md:block rounded-xl border bg-card shadow-sm h-full max-h-[550px] overflow-y-auto scrollbar-thin relative">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              {renderHeader("Company", "company")}
              {renderHeader("Role", "role", false)}
              {renderHeader("Location", "location", false)}
              {renderHeader("Status", "status", false)}
              {renderHeader("Applied", "applied_date")}
              {renderHeader("Follow-Up", "next_follow_up_date", false)}
              <TableHead className="font-semibold py-2 px-4 sticky top-0 bg-muted/95 backdrop-blur-sm z-10 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const overdue = isOverdue(app.next_follow_up_date);
              return (
                <TableRow
                  key={app.id}
                  className={`transition-colors ${overdue ? "bg-amber-500/10 dark:bg-amber-500/10 border-l-4 border-l-amber-500" : "hover:bg-muted/30"}`}
                >
                  <TableCell className="font-medium py-2 px-4">
                    {app.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-2 px-4">
                    {app.role}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <LocationBadge location={app.location} />
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <Select
                      value={app.status}
                      onValueChange={(val) => onStatusChange(app.id, val)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs border-0 bg-transparent p-0">
                        <StatusBadge status={app.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            disabled={isStatusTransitionDisabled(app.status, s)}
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-2 px-4">
                    {formatDate(app.applied_date)}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      {overdue && (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span
                        className={`text-sm ${overdue ? "text-amber-600 font-medium" : "text-muted-foreground"}`}
                      >
                        {formatDate(app.next_follow_up_date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(app)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteTarget(app.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {applications.map((app) => {
          const overdue = isOverdue(app.next_follow_up_date);
          return (
            <div
              key={app.id}
              className={`rounded-xl border bg-card p-4 shadow-sm space-y-3 ${overdue ? "border-l-4 border-l-amber-500 bg-amber-500/10 dark:bg-amber-500/10" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {app.company}
                  </h3>
                  <p className="text-sm text-muted-foreground">{app.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(app)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => setDeleteTarget(app.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LocationBadge location={app.location} />
                <Select
                  value={app.status}
                  onValueChange={(val) => onStatusChange(app.id, val)}
                >
                  <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0">
                    <StatusBadge status={app.status} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        disabled={isStatusTransitionDisabled(app.status, s)}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Applied: {formatDate(app.applied_date)}</span>
                {app.next_follow_up_date && (
                  <span
                    className={`flex items-center gap-1 ${overdue ? "text-amber-600 font-medium" : ""}`}
                  >
                    {overdue && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    Follow-up: {formatDate(app.next_follow_up_date)}
                  </span>
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
        description="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ApplicationList;
