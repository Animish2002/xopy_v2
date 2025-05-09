import React, { useState, useEffect } from "react";
import { Printer, Copy, Loader2, View, SquarePen, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const ViewPricing = () => {
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPricingData = async () => {
    try {
      const id = localStorage.getItem("shopOwnerId");
      if (!id) throw new Error("No ID found");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/pricing-config/${id}`
      );
      if (!response.ok)
        throw new Error("Failed to fetch pricing configuration");
      const data = await response.json();
      setPricingConfig(data.pricingConfig);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  const handleDelete = async (configId) => {
    if (!window.confirm("Are you sure you want to delete this pricing configuration?")) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/delete-pricing-config/${configId}`,
        {
          method: "DELETE",
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to delete pricing configuration");
      }
      
      // Refresh the pricing data after deletion
      fetchPricingData();
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="p-4 md:text-2xl text-lg ui font-semibold">
            View Pricing
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-40" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="w-full max-w-6xl mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="p-4 md:text-2xl text-lg ui font-semibold">
          View Pricing
        </div>

        {pricingConfig?.length === 0 ? (
          <Alert className="mb-6">
            <AlertTitle>No pricing configurations found</AlertTitle>
            <AlertDescription>
              No pricing configurations have been set up yet.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingConfig?.map((config) => (
              <Card
                key={config.id}
                className="overflow-hidden transition-all hover:shadow-lg relative"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Printer className="h-5 w-5 text-primary" />
                      <CardTitle>{config.paperType}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {config.printType.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription>Pricing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center rounded-md p-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Single Sided</span>
                    </div>
                    <span className="font-bold">
                      ₹ {parseFloat(config.singleSided).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center rounded-md p-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Double Sided</span>
                    </div>
                    <span className="font-bold">
                      ₹ {parseFloat(config.doubleSided).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  Last updated: {formatDate(config.createdAt)}
                </CardFooter>
                <button
                  onClick={() => navigate(`/shopowner/edit-pricing/${config.id}`)}
                  className="absolute bottom-4 right-24 px-2 py-1 rounded-lg text-sm cursor-pointer hover:bg-zinc-100"
                >
                  <SquarePen className="inline p-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(config.id)}
                  disabled={deleteLoading}
                  className="absolute bottom-4 right-4 px-2 py-1 rounded-lg text-sm cursor-pointer hover:bg-zinc-100 text-red-500 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <Loader2 className="inline p-1 animate-spin" />
                  ) : (
                    <Trash className="inline p-1" />
                  )}
                  Delete
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewPricing;