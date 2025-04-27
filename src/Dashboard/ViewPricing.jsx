import React, { useState, useEffect } from "react";
import { Printer, Copy, Loader2, View } from "lucide-react";
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

const ViewPricing = () => {
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const id = localStorage.getItem("sessionId");
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

    fetchPricingData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="p-4 md:text-2xl text-lg ui font-semibold">
            Download QR
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
      <div className="w-full max-w-6xl mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="p-4 md:text-2xl text-lg ui font-semibold">
          Download QR
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
                className="overflow-hidden transition-all hover:shadow-lg"
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
                      ${parseFloat(config.singleSided).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center rounded-md p-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Double Sided</span>
                    </div>
                    <span className="font-bold">
                      ${parseFloat(config.doubleSided).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  Last updated: {formatDate(config.createdAt)}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewPricing;
