//import { useEffect, useState } from "react";
//
//export function useGroupedServices() {
//  const [groups, setGroups] = useState({});
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//
//  useEffect(() => {
//    fetch(`${import.meta.env.VITE_API_URL}/grouped`)
//      .then(res => res.json())
//      .then(setGroups)
//      .catch(err => {
//        console.error("Ошибка загрузки сгруппированных услуг:", err);
//        setError(err);
//      })
//      .finally(() => setLoading(false));
//  }, []);
//
//  return { groups, loading, error };
//}

import { useEffect, useState } from "react";

export default function useGroupedServices() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/grouped`)
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки сгруппированных услуг:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { groups, loading, error };
}