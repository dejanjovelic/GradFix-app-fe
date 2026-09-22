import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";
import { getReportStatuses } from "../api/reportStatusApi";

export function useReportLookups() {
  const [state, setState] = useState({
    categories: [],
    statuses: [],
    loading: true,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: "" }));
    Promise.allSettled([getCategories(), getReportStatuses()]).then(
      ([categories, statuses]) => {
        if (!active) return;
        setState({
          categories:
            categories.status === "fulfilled" ? (categories.value ?? []) : [],
          statuses:
            statuses.status === "fulfilled" ? (statuses.value ?? []) : [],
          loading: false,
          error: [categories, statuses].some(
            (result) => result.status === "rejected",
          )
            ? "Some filters could not be loaded. You can still browse reports."
            : "",
        });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
