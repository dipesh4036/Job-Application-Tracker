import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  LOCATIONS,
  STATUSES,
} from "../validations/applicationSchemas";
import dayjs from "dayjs";
import { isStatusTransitionDisabled } from "../utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const ApplicationModal = ({
  open,
  onOpenChange,
  onSubmit,
  application = null,
  loading = false,
}) => {
  const isEdit = !!application;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "remote",
      status: "Applied",
      appliedDate: dayjs().format("YYYY-MM-DD"),
      nextFollowUpDate: "",
      salaryExpectation: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (application) {
        reset({
          company: application.company || "",
          role: application.role || "",
          location: application.location || "remote",
          status: application.status || "Applied",
          appliedDate: application.applied_date
            ? dayjs(application.applied_date).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
          nextFollowUpDate: application.next_follow_up_date
            ? dayjs(application.next_follow_up_date).format("YYYY-MM-DD")
            : "",
          salaryExpectation: application.salary_expectation || "",
          notes: application.notes || "",
        });
      } else {
        reset({
          company: "",
          role: "",
          location: "remote",
          status: "Applied",
          appliedDate: dayjs().format("YYYY-MM-DD"),
          nextFollowUpDate: "",
          salaryExpectation: "",
          notes: "",
        });
      }
    }
  }, [application, reset, open]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const locationValue = watch("location");
  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Application" : "Add New Application"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 pt-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g. Google"
                {...register("company")}
              />
              {errors.company && (
                <p className="text-xs text-red-500">{errors.company.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                placeholder="e.g. Frontend Developer"
                {...register("role")}
              />
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location *</Label>
              <Select
                value={locationValue}
                onValueChange={(val) => setValue("location", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc.charAt(0).toUpperCase() + loc.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      disabled={
                        isEdit &&
                        isStatusTransitionDisabled(application?.status, s)
                      }
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appliedDate">Applied Date *</Label>
              <Input
                id="appliedDate"
                type="date"
                {...register("appliedDate")}
              />
              {errors.appliedDate && (
                <p className="text-xs text-red-500">
                  {errors.appliedDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextFollowUpDate">Next Follow-Up Date</Label>
              <Input
                id="nextFollowUpDate"
                type="date"
                {...register("nextFollowUpDate")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryExpectation">Salary Expectation</Label>
            <Input
              id="salaryExpectation"
              type="number"
              placeholder="e.g. 80000"
              {...register("salaryExpectation")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this application..."
              rows={3}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
