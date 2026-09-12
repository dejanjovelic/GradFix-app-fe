import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getMapReports } from "../../api/reportApi";
import { useReportLookups } from "../../hooks/useReportLookups";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { hasReportCoordinates, readReportFilters, updateReportFilter } from "../../utils/reportFilters";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportsMap from "./ReportsMap";
import "./map-page.scss";

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const filters = readReportFilters(params);
  const { categoryId, statusId } = filters;
  const lookups = useReportLookups();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { document.title = "Map | GradFix"; }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMapReports({ categoryId, statusId }).then(data => {
      if (active) setReports((data ?? []).filter(hasReportCoordinates));
    }).catch(failure => {
      if (active) { setReports([]); setError(getErrorMessage(failure)); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [categoryId, statusId, attempt]);
  return <section className="civic-container map-page" aria-labelledby="map-heading">
    <span className="civic-eyebrow">Live overview</span>
    <h1 className="civic-title" id="map-heading">Reports across the city</h1>
    <div className="map-page__intro"><p>Select a marker to open its public details.</p>
      <Link className="civic-link" to="/"><ArrowLeft size={16} aria-hidden="true" />Browse reports</Link>
    </div>
    <ReportFilters showSearch={false} filters={filters} lookups={lookups}
      onChange={(key, value) => setParams(current => updateReportFilter(current, key, value), { replace: true })} />
    <p className="map-page__count" role="status">{loading ? "Loading report locations…" : error ? "Map data unavailable" : `${reports.length} ${reports.length === 1 ? "report" : "reports"} on the map`}</p>
    {error && <div className="civic-feedback civic-feedback--error" role="alert">{error}<button type="button" onClick={() => setAttempt(value => value + 1)}>Retry map</button></div>}
    {!loading && !error && !reports.length && <p className="civic-feedback">No reported locations match these filters.</p>}
    <ReportsMap reports={loading ? [] : reports} />
  </section>;
}
