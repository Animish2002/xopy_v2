import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import PrintJobCard from "./PrintJobCard";

const PrintJobsList = ({
  jobs,
  loading,
  selectedJob,
  selectedTab,
  onTabChange,
  onJobSelect,
  onStatusUpdate,
  updatingStatus,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Print Jobs</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Status: Pending</DropdownMenuItem>
              <DropdownMenuItem>Status: Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-0">
        <Tabs
          value={selectedTab}
          onValueChange={onTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="divide-y divide-slate-100">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))
          ) : jobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No print jobs found</p>
            </div>
          ) : (
            jobs.map((job) => (
              <PrintJobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onSelect={onJobSelect}
                onStatusUpdate={onStatusUpdate}
                updatingStatus={updatingStatus}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default PrintJobsList;