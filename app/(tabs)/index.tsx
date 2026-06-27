import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";

type Category = "Food" | "Transpo" | "Bills";
type FilterOption = "All" | Category;

interface Expense {
  id: string;
  item: string;
  amount: number;
  category: Category;
}

const CATEGORY_EMOJI: Record<Category, string> = {
  Food: "🍟",
  Transpo: "🚗",
  Bills: "💵",
};

const INITIAL_EXPENSES: Expense[] = [
  { id: "1", item: "Jollibee Lunch", amount: 180, category: "Food" },
  { id: "2", item: "Angkas Ride", amount: 95, category: "Transpo" },
  { id: "3", item: "Meralco Bill", amount: 1500, category: "Bills" },
];

const CATEGORIES: Category[] = ["Food", "Transpo", "Bills"];
const FILTERS: FilterOption[] = ["All", "Food", "Transpo", "Bills"];

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [item, setItem] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Food");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses: Expense[] =
    activeFilter === "All"
      ? expenses
      : expenses.filter((e) => e.category === activeFilter);

  function handleAddExpense() {
    const parsedAmount = parseFloat(amount);
    if (!item.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        item: item.trim(),
        amount: parsedAmount,
        category: selectedCategory,
      },
    ]);
    setItem("");
    setAmount("");
    Keyboard.dismiss();
  }

  function handleDelete(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Expense Tracker</Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.summaryCard}>
              <Text style={styles.totalLabel}>TOTAL (ALL)</Text>
              <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
            </View>
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Item (Baon, Pamasahe)"
                placeholderTextColor="#9ca3af"
                value={item}
                onChangeText={setItem}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount (₱)"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.categoryLabel}>SELECT CATEGORY:</Text>

              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      selectedCategory === cat
                        ? styles.categoryButtonActive
                        : styles.categoryButtonInactive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === cat
                          ? styles.categoryButtonTextActive
                          : styles.categoryButtonTextInactive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddExpense}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>+ Add Expense</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterButton,
                    activeFilter === f
                      ? styles.filterButtonActive
                      : styles.filterButtonInactive,
                  ]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      activeFilter === f
                        ? styles.filterButtonTextActive
                        : styles.filterButtonTextInactive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredExpenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses found.</Text>
            ) : (
              filteredExpenses.map((expense) => (
                <View key={expense.id} style={styles.expenseCard}>
                  <Text style={styles.categoryEmoji}>
                    {CATEGORY_EMOJI[expense.category]}
                  </Text>
                  <View style={styles.cardTextBlock}>
                    <Text style={styles.cardTitle}>{expense.item}</Text>
                    <Text style={styles.cardSubtitle}>{expense.category}</Text>
                  </View>
                  <Text style={styles.cardAmount}>
                    ₱{expense.amount.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(expense.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteText}>❌</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    backgroundColor: "#1f2937",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: "#10b981",
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    color: "#e6fffa",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  totalValue: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1f2937",
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#3b82f6",
  },
  categoryButtonInactive: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "#ffffff",
  },
  categoryButtonTextInactive: {
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: "#1f2937",
  },
  filterButtonInactive: {
    backgroundColor: "#e5e7eb",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  filterButtonTextInactive: {
    color: "#374151",
  },
  emptyText: {
    color: "#9ca3a0",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  categoryEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 2,
  },
  cardAmount: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
  },
});
