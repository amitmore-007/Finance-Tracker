"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { formatCurrency } from "@/lib/utils";
import { getCategoryById } from "@/lib/categories";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
  Calendar,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface Budget {
  _id?: string;
  category: string;
  amount: number;
  spent: number; // Changed from spent?: number if necessary
  period: "monthly" | "weekly" | "yearly";
  month: number;
  year: number;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

// In your BudgetsPage component, update the handleAddBudget function definition:
const handleAddBudget = async (budget: Omit<Budget, "_id">) => {
  try {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    });

    if (response.ok) {
      await fetchBudgets();
      setShowForm(false);
    } else {
      const error = await response.json();
      alert(error.error || "Failed to create budget");
    }
  } catch (error) {
    console.error("Error adding budget:", error);
    alert("Failed to create budget");
  }
};

// And update the BudgetForm props interface to match:
interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, "_id">) => void;
  onCancel: () => void;
  initialData?: Omit<Budget, "_id">;
  existingCategories: string[];
}
  const handleEditBudget = async (budgetData: Omit<Budget, "_id">) => {
    if (!editingBudget?._id) return;

    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: budgetData.amount }),
      });

      if (response.ok) {
        await fetchBudgets();
        setEditingBudget(null);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBudgets();
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              width: "80px",
              height: "80px",
              border: "6px solid rgba(102, 126, 234, 0.2)",
              borderTop: "6px solid #667eea",
              borderRadius: "50%",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "white",
              textAlign: "center",
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            Loading your budgets...
          </motion.div>
        </div>
      </Layout>
    );
  }

  const existingCategories = budgets.map((budget) => budget.category);

  // Define cards array for budget overview
  const cards = [
    {
      title: "Total Budgets",
      value: budgets.length,
      icon: Target,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadowColor: "rgba(16, 185, 129, 0.4)",
      isCount: true,
      subtitle: budgets.length === 1 ? "Active budget" : "Active budgets",
    },
    {
      title: "Total Allocated",
      value: budgets.reduce((sum, budget) => sum + budget.amount, 0),
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadowColor: "rgba(245, 158, 11, 0.4)",
      isCount: false,
      subtitle: "Monthly budget limit",
    },
    {
      title: "Total Spent",
      value: budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0),
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      shadowColor: "rgba(239, 68, 68, 0.4)",
      isCount: false,
      subtitle: "Current month spending",
    },
  ];

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
            backdropFilter: "blur(24px)",
            borderRadius: "32px",
            padding: "48px",
            boxShadow: "0 32px 64px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "100px",
              height: "100px",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
              borderRadius: "50%",
              animation: "float 6s ease-in-out infinite",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "32px",
              position: "relative",
              zIndex: 2,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "16px",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: "64px",
                    height: "64px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  <Target size={32} />
                </motion.div>
                <div>
                  <h1
                    style={{
                      fontSize: "48px",
                      fontWeight: "900",
                      margin: "0",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      letterSpacing: "-1px",
                    }}
                  >
                    Budget Manager
                  </h1>
                </div>
              </div>
              <p
                style={{
                  fontSize: "18px",
                  color: "#6b7280",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "500",
                }}
              >
                <Sparkles size={20} style={{ color: "#667eea" }} />
                Set and track your spending limits with smart insights
              </p>
            </div>

            {/* Enhanced Create Button */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "20px",
                    padding: "20px 32px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Plus size={20} />
                  Create Budget
                </motion.button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle style={{ display: "none" }}>
                  Create Budget
                </DialogTitle>
                <BudgetForm
                  onSubmit={handleAddBudget}
                  onCancel={() => setShowForm(false)}
                  existingCategories={existingCategories}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Cards Overview Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginTop: "40px",
            }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: card.gradient,
                  borderRadius: "28px",
                  padding: "40px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: `0 25px 50px ${card.shadowColor}`,
                }}
              >
                {/* Animated background pattern */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-50%",
                    width: "200%",
                    height: "200%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    animation: `rotate 20s linear infinite ${index * 2}s`,
                  }}
                />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: "56px",
                        height: "56px",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <card.icon size={28} />
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: "16px",
                          opacity: 0.9,
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          display: "block",
                        }}
                      >
                        {card.title}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          opacity: 0.7,
                          fontWeight: "500",
                        }}
                      >
                        {card.subtitle}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      letterSpacing: "-1px",
                    }}
                  >
                    {card.isCount ? card.value : formatCurrency(card.value)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Budget List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(24px)",
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              padding: "32px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#374151",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <ArrowRight size={24} style={{ color: "#667eea" }} />
              Your Budget Overview
            </h2>
          </div>

          <div style={{ padding: "32px" }}>
            {budgets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "#6b7280",
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ fontSize: "80px", marginBottom: "24px" }}
                >
                  🎯
                </motion.div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#374151",
                    margin: "0 0 12px 0",
                  }}
                >
                  No budgets created yet
                </h3>
                <p style={{ margin: "0 0 32px 0", fontSize: "16px" }}>
                  Start your financial journey by creating your first budget
                </p>
                <Dialog open={showForm} onOpenChange={setShowForm}>
  <DialogTrigger asChild>
    <button
      onClick={() => setShowForm(true)}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "16px",
        padding: "16px 32px",
        color: "white",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.4)",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Plus size={20} />
        Create Your First Budget
                     </motion.div>
    </button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle style={{ display: "none" }}>
      Create Your First Budget
    </DialogTitle>
    <BudgetForm
      onSubmit={handleAddBudget}
      onCancel={() => setShowForm(false)}
      existingCategories={existingCategories}
    />
  </DialogContent>
</Dialog>
              </motion.div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <AnimatePresence>
                  {budgets.map((budget, index) => {
                    const category = getCategoryById(budget.category);
                    const percentage =
                      budget.amount > 0
                        ? (budget.spent / budget.amount) * 100
                        : 0;
                    const isOverBudget = percentage > 100;
                    const isNearLimit = percentage > 80 && percentage <= 100;

                    return (
                      <motion.div
                        key={budget._id}
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 30, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        style={{
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                          border: `3px solid ${
                            isOverBudget
                              ? "#ef4444"
                              : isNearLimit
                              ? "#f59e0b"
                              : "rgba(102, 126, 234, 0.2)"
                          }`,
                          borderRadius: "24px",
                          padding: "32px",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "6px",
                            background: isOverBudget
                              ? "linear-gradient(90deg, #ef4444, #dc2626)"
                              : isNearLimit
                              ? "linear-gradient(90deg, #f59e0b, #d97706)"
                              : "linear-gradient(90deg, #10b981, #059669)",
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "24px",
                            flexWrap: "wrap",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "20px",
                            }}
                          >
                            <motion.div
                              whileHover={{ rotate: 15, scale: 1.1 }}
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                background: `linear-gradient(135deg, ${
                                  category?.color || "#8395A7"
                                }30, ${category?.color || "#8395A7"}60)`,
                                border: `3px solid ${
                                  category?.color || "#8395A7"
                                }`,
                                boxShadow: `0 12px 30px ${
                                  category?.color || "#8395A7"
                                }30`,
                              }}
                            >
                              {category?.icon || "📦"}
                            </motion.div>
                            <div>
                              <h3
                                style={{
                                  fontSize: "24px",
                                  fontWeight: "800",
                                  color: "#1f2937",
                                  margin: "0 0 8px 0",
                                  letterSpacing: "-0.5px",
                                }}
                              >
                                {category?.name || budget.category}
                              </h3>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    textTransform: "capitalize",
                                    background:
                                      "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.2))",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#667eea",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <Calendar size={12} />
                                  {budget.period}
                                </span>
                                {isOverBudget && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      color: "#ef4444",
                                      background: "rgba(239, 68, 68, 0.1)",
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <AlertTriangle size={16} />
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Over Budget
                                    </span>
                                  </motion.div>
                                )}
                                {isNearLimit && !isOverBudget && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      color: "#f59e0b",
                                      background: "rgba(245, 158, 11, 0.1)",
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <AlertTriangle size={16} />
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Near Limit
                                    </span>
                                  </motion.div>
                                )}
                                {percentage <= 80 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      color: "#10b981",
                                      background: "rgba(16, 185, 129, 0.1)",
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <CheckCircle size={16} />
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      On Track
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: "12px" }}>
                            <Dialog
                              open={editingBudget?._id === budget._id}
                              onOpenChange={(open) => {
                                if (!open) setEditingBudget(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => setEditingBudget(budget)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    margin: 0,
                                    cursor: "pointer",
                                  }}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                      border: "none",
                                      borderRadius: "12px",
                                      padding: "12px",
                                      color: "white",
                                      boxShadow:
                                        "0 8px 20px rgba(59, 130, 246, 0.3)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Edit size={18} />
                                  </motion.div>
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle style={{ display: "none" }}>
                                  Edit Budget
                                </DialogTitle>
                                <BudgetForm
                                  onSubmit={handleEditBudget}
                                  onCancel={() => setEditingBudget(null)}
                                  initialData={editingBudget || undefined}
                                  existingCategories={existingCategories}
                                />
                              </DialogContent>
                            </Dialog>

                            <button
                              onClick={() => {
                                if (budget._id) handleDeleteBudget(budget._id);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                cursor: "pointer",
                              }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  background:
                                    "linear-gradient(135deg, #ef4444, #dc2626)",
                                  border: "none",
                                  borderRadius: "12px",
                                  padding: "12px",
                                  color: "white",
                                  boxShadow:
                                    "0 8px 20px rgba(239, 68, 68, 0.3)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Trash2 size={18} />
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        {/* Enhanced Progress Section */}
                        <div style={{ marginBottom: "20px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "#374151",
                              }}
                            >
                              Progress
                            </span>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: isOverBudget ? "#ef4444" : "#6b7280",
                              }}
                            >
                              {percentage.toFixed(1)}%
                            </span>
                          </div>

                          {/* Enhanced Progress Bar */}
                          <div
                            style={{
                              width: "100%",
                              height: "12px",
                              background: "rgba(0, 0, 0, 0.1)",
                              borderRadius: "12px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(percentage, 100)}%`,
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                background: isOverBudget
                                  ? "linear-gradient(90deg, #ef4444, #dc2626)"
                                  : isNearLimit
                                  ? "linear-gradient(90deg, #f59e0b, #d97706)"
                                  : "linear-gradient(90deg, #10b981, #059669)",
                                borderRadius: "12px",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                  animation: "shimmer 2s infinite",
                                }}
                              />
                            </motion.div>

                            {/* Over budget indicator */}
                            {isOverBudget && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage - 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #dc2626, #991b1b)",
                                  borderRadius: "12px",
                                  animation: "pulse 2s infinite",
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Enhanced Amount Details */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "16px",
                            marginTop: "20px",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                              padding: "16px",
                              borderRadius: "16px",
                              border: "2px solid rgba(16, 185, 129, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#059669",
                                fontWeight: "600",
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Zap size={12} />
                              Budget
                            </div>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "800",
                                color: "#059669",
                              }}
                            >
                              {formatCurrency(budget.amount)}
                            </div>
                          </div>

                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                              padding: "16px",
                              borderRadius: "16px",
                              border: "2px solid rgba(239, 68, 68, 0.2)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#dc2626",
                                fontWeight: "600",
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <TrendingUp size={12} />
                              Spent
                            </div>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "800",
                                color: "#dc2626",
                              }}
                            >
                              {formatCurrency(budget.spent)}
                            </div>
                          </div>

                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))",
                              padding: "16px",
                              borderRadius: "16px",
                              border: "2px solid rgba(102, 126, 234, 0.2)",
                              gridColumn: "span 2",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#4f46e5",
                                fontWeight: "600",
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <DollarSign size={12} />
                              Remaining
                            </div>
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "800",
                                color:
                                  budget.amount - budget.spent >= 0
                                    ? "#4f46e5"
                                    : "#dc2626",
                              }}
                            >
                              {formatCurrency(budget.amount - budget.spent)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </Layout>
  );
}
