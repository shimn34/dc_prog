// src/routes/TermGate.jsx
import { useEffect, useState } from "react";
import { getTerms } from "../services/courseService";
import { useAuth } from "../hooks/useAuth";
import NoTerm from "../pages/NoTerm/NoTerm";

export default function TermGate({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasTerm, setHasTerm] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;

    getTerms(user.uid).then((list) => {
      if (!mounted) return;

      setHasTerm(list && list.length > 0);
      setLoading(false);
    });

    return () => (mounted = false);
  }, [user?.uid]);

  if (loading) return <div>Loading...</div>;

  // 学期が 0 件
  if (!hasTerm) return <NoTerm />;

  // 学期が 1 つ以上ある → Home など children を表示
  return children;
}
