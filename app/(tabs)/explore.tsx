import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";

const BUTTONS = [
  ["C", "+/-", "%", "+"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  [".", "0", "⌫", "="],
];

const OPERATOR_KEYS = ["+", "×", "−", "="];
const GRAY_KEYS = ["C", "+/-", "%"];

export default function ExploreScreen() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  function handlePress(key: string) {
    if (key === "C") {
      setExpression("");
      setDisplay("0");
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      return;
    }

    if (key === "⌫") {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay("0");
      }
      return;
    }

    if (key === "+/-") {
      const val = parseFloat(display);
      setDisplay(String(-val));
      return;
    }

    if (key === "%") {
      const val = parseFloat(display);
      setDisplay(String(val / 100));
      return;
    }

    if (OPERATOR_KEYS.includes(key) && key !== "=") {
      const current = parseFloat(display);
      setExpression(display + " " + key + " ");
      setPrevValue(current);
      setOperator(key);
      setWaitingForOperand(true);
      return;
    }

    if (key === "=") {
      if (prevValue !== null && operator) {
        const current = parseFloat(display);
        let result = 0;
        if (operator === "+") result = prevValue + current;
        if (operator === "−") result = prevValue - current;
        if (operator === "×") result = prevValue * current;
        if (operator === "÷") result = prevValue / current;
        const resultStr = Number.isInteger(result)
          ? String(result)
          : String(parseFloat(result.toFixed(8)));
        setExpression(expression + display + " =");
        setDisplay(resultStr);
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
      }
      return;
    }

    if (key === ".") {
      if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    if (waitingForOperand) {
      setDisplay(key);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? key : display + key);
    }
  }

  function getButtonStyle(key: string) {
    if (OPERATOR_KEYS.includes(key)) return [styles.btn, styles.btnGreen];
    if (GRAY_KEYS.includes(key)) return [styles.btn, styles.btnGray];
    return [styles.btn, styles.btnNumber];
  }

  function getTextStyle(key: string) {
    if (OPERATOR_KEYS.includes(key))
      return [styles.btnText, styles.btnTextGreen];
    return [styles.btnText, styles.btnTextDark];
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f0" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculator</Text>
      </View>

      <View style={styles.display}>
        <Text style={styles.expression} numberOfLines={1}>
          {expression || " "}
        </Text>
        <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.keypad}>
        {BUTTONS.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={getButtonStyle(key)}
                onPress={() => handlePress(key)}
                activeOpacity={0.75}
              >
                <Text style={getTextStyle(key)}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f0",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#a8d060",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2937",
  },
  display: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 16,
  },
  expression: {
    fontSize: 15,
    color: "#9ca3af",
    marginBottom: 4,
  },
  result: {
    fontSize: 52,
    fontWeight: "300",
    color: "#1f2937",
  },
  keypad: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNumber: {
    backgroundColor: "#e4e4e4",
  },
  btnGray: {
    backgroundColor: "#d0d0d0",
  },
  btnGreen: {
    backgroundColor: "#a8d060",
  },
  btnText: {
    fontSize: 22,
    fontWeight: "500",
  },
  btnTextDark: {
    color: "#1f2937",
  },
  btnTextGreen: {
    color: "#ffffff",
  },
});
