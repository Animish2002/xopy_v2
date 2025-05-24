import React, { useState } from "react";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals getting started",
      monthlyPrice: 9,
      annualPrice: 90,
      features: [
        "5 Projects",
        "10GB Storage",
        "Basic Support",
        "Core Features",
        "Mobile App Access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Unlimited Projects",
        "100GB Storage",
        "Priority Support",
        "Advanced Analytics",
        "Team Collaboration",
        "API Access",
        "Custom Integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Everything in Professional",
        "Unlimited Storage",
        "24/7 Dedicated Support",
        "Custom Solutions",
        "Advanced Security",
        "SLA Guarantee",
        "Training & Onboarding",
      ],
      popular: false,
    },
  ];

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    const annualMonthly = plan.annualPrice / 12;
    const savings = (
      ((plan.monthlyPrice - annualMonthly) / plan.monthlyPrice) *
      100
    ).toFixed(0);
    return savings;
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
            Pricing
          </h2>
          <p className="ui text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-300">
            Choose the perfect plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Simple, transparent pricing that grows with you. Try any plan free
            for 30 days.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="relative bg-white rounded-full p-1 shadow-sm ring-1 ring-gray-900/10">
            <div className="flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  !isAnnual
                    ? "text-white bg-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isAnnual
                    ? "text-white bg-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Annual
                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Save up to 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-500 transform hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-2xl ring-2 ring-yellow-200"
                  : "bg-white shadow-lg ring-1 ring-gray-900/10 hover:shadow-xl"
              } rounded-3xl flex h-full flex-col justify-between px-8 py-10`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div>
                {/* Plan Name */}
                <h3
                  className={`text-xl font-semibold ${
                    plan.popular ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Description */}
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <div className="flex items-baseline gap-x-2">
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        plan.popular ? "text-gray-900" : "text-gray-900"
                      }`}
                    >
                      ${getPrice(plan)}
                    </span>
                    <span
                      className={`text-sm font-semibold leading-6 ${
                        plan.popular ? "text-gray-700" : "text-gray-600"
                      }`}
                    >
                      /{isAnnual ? "year" : "month"}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      Save {getSavings(plan)}% vs monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-5 w-5 flex-none ${
                          plan.popular ? "text-yellow-600" : "text-green-600"
                        }`}
                      />
                      <span
                        className={`text-sm leading-6 ${
                          plan.popular ? "text-gray-700" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`mt-8 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 hover:from-yellow-500 hover:to-amber-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow hover:shadow-lg"
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600">
            All plans include a 30-day free trial. No credit card required.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;
