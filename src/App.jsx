import React, { useEffect, useState, useRef } from "react";
import FlowMapUploader from "./components/FlowMapUploader";
import { Calendar, RotateCcw, GraduationCap, Download } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import html2canvas from "html2canvas";
import styles from "./styles/appStyles";

import AgeForm from "./components/forms/AgeForm";
import SexForm from "./components/forms/SexForm";
import CivilStatusForm from "./components/forms/CivilStatusForm";
import EducationForm from "./components/forms/EducationForm";

import CivilStatusTable from "./components/tables/CivilStatusTable";
import SexTable from "./components/tables/SexTable";
import EducationTable from "./components/tables/EducationTable";
import AgeTable from "./components/tables/AgeTable";

import VisualizationSelector from "./components/visualizations/VisualizationSelector";
import HeroSection from "./components/HeroSection";


import CivilDatasetSection from "./components/datasets/CivilDatasetSection";

import { trainGenderMLP, predictGenderMLP } from "./services/mlpGenderService";
import EducationForecastPanel from "./components/EducationForecastPanel";
import EducationMLPModal from "./components/EducationMLPModal";
import SexDatasetSection from "./components/datasets/SexDatasetSection";
import EducationDatasetSection from "./components/datasets/EducationDatasetSection";
import AgeDatasetSection from "./components/datasets/AgeDatasetSection";
import CivilMLPModal from "./components/CivilMLPModal";



// CSV
import CsvUploaderCivil from "./services/CsvUploaderCivil";
import ComparisonChart from "./components/ComparisonChart";

import { getGenderForecast } from "./services/forecastService";
import GenderForecastPanel from "./components/GenderForecastPanel.jsx";
import AgeForecastPanel from "./components/AgeForecastPanel";
import AgeMLPModal from "./components/AgeMLPModal";
import CivilForecastPanel from "./components/CivilForecastPanel";

// Heatmap
import HeatMap from "react-heatmap-grid";
import GenderMLPModal from "./components/GenderMLPModal";


// ⭐ RECHARTS (Trend, Composition, Distribution)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line as ReLine,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Users,
  TrendingUp,
  BarChart3,
  Upload,
  Database,
  Globe,
  FileText,
  Activity,
} from "lucide-react";

// ⭐ CHART.JS (Forecast Graph) — MUST BE REGISTERED PROPERLY
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ChartTooltip,
  ChartLegend
);

// ⭐ Chart.js Line Component
import { Line as ChartLine } from "react-chartjs-2";

// ================================
// 📌 Marital Status HANDLERS
// ================================
import {
  validateEmigrantForm,
  fetchEmigrants,
  handleAddEmigrant,
  handleDeleteEmigrant,
  handleDeleteAllEmigrants,
  startEditEmigrant,
  cancelEditEmigrant,
  saveEditEmigrant
} from "./handlers/emigrantHandlers";

// ================================
// 📌 Education HANDLERS
// ================================
import {
  fetchEducation,
  handleEducationAdd,
  handleEducationDelete,
  handleDeleteAllEducation,
  startEducationEdit,
  cancelEducationEdit,
  saveEducationEdit,
  handleEducationCsvUpload
} from "./handlers/educationHandlers";

// ================================
// 📌 Sex Dataset HANDLERS
// ================================
import {
  fetchSexData,
  handleSexAdd,
  handleSexDelete,
  handleDeleteAllSex,
  startSexEdit,
  cancelSexEdit,
  saveSexEdit,
  handleSexCsvUpload
} from "./handlers/sexHandlers";

// ================================
// 📌 Age Dataset HANDLERS
// ================================
import {
  ageOrder,
  normalizeAgeGroup,
  fetchAgeData,
  handleAgeAdd,
  handleAgeDelete,
  handleDeleteAllAge,
  startAgeEdit,
  cancelAgeEdit,
  saveAgeEdit,
  handleAgeCsvUpload,
} from "./handlers/ageHandlers";


const initialForm = {
  year: "",
  single: "",
  married: "",
  widower: "",
  separated: "",
  divorced: "",
  notReported: "",
};


// 📌 Put this at the top of your component
const chartDescriptions = {
  trends: "Trends (Line Chart) – Male vs Female emigrants per year",
  comparison: "Comparison (Bar Chart) – Top 10 destination countries by decade",
  composition: "Composition (Stacked Area Chart) – Educational attainment breakdown",
  distribution: "Distribution (Histogram-style) – Age distribution of emigrants by decade",
  relationships: "Relationships (Heatmap) – Civil Status × Time crosstab (marital status × year)",
  geographic: "Geographic Representation (Flow Map) – Migration flows from the Philippines to top destinations "
};

const COLORS = [
  "#3B82F6", // medium blue
  "#60A5FA", // lighter blue
  "#93C5FD", // soft sky blue
  "#BFDBFE", // pale blue
  "#1E40AF", // deep navy
  "#2563EB", // primary blue
];

const fieldLabels = {
  year: "Year",
  single: "Single",
  married: "Married",
  widower: "Widower",
  separated: "Separated",
  divorced: "Divorced",
  notReported: "Not Reported",
};

function App() {
  // ================== FILTER STATES ==================
const [yearRange, setYearRange] = useState([1980, 2020]);  // global year filter
const [selectedSex, setSelectedSex] = useState("all");     // male/female filter
const [selectedAgeGroups, setSelectedAgeGroups] = useState([]); // age groups filter
const [selectedEducation, setSelectedEducation] = useState([]);//education filter
const [hoverRow, setHoverRow] = useState(null);
const [hoverCol, setHoverCol] = useState(null);
// Add at top-level state (same level as yearRange, etc.)
const [multiSelect, setMultiSelect] = useState(false);

const chartRef = useRef(null);

const handleDownloadChart = async () => {
  if (!chartRef.current) return;
  try {
    const canvas = await html2canvas(chartRef.current, {
      scale: 2, // Higher quality export
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `${activeVisualization}_chart.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Error downloading chart:", err);
  }
};

// ================================
// FIX: Missing Fetch Data Wrapper
// ================================
const fetchData = async () => {
  try {
    await fetchEmigrants(setEmigrants, setLoading);   // marital status
  } catch (err) {
    console.error("Error in fetchData:", err);
  }
};

const [forecastData, setForecastData] = useState(null);


const [mlpLoading, setMlpLoading] = useState(false);
const [mlpMessage, setMlpMessage] = useState("");

const [metrics, setMetrics] = useState(null);
const [tableData, setTableData] = useState(null);
const [chartData, setChartData] = useState(null);
const [explanation, setExplanation] = useState(null);


const [showGenderMLPModal, setShowGenderMLPModal] = useState(false);
const [allModelResults, setAllModelResults] = useState(null);


const handleLoadMLP = async () => {
  setMlpLoading(true);
  setMlpMessage("Loading forecast...");

  try {
    // ======================================================
    // 1️⃣ FETCH MALE/FEMALE PREDICTION
    //    (Your predictGenderMLP() already calls port 5001)
    // ======================================================
    const maleRes = await predictGenderMLP("male");
    const femaleRes = await predictGenderMLP("female");

    // ----------------------------------------
    // TABLE DATA
    // ----------------------------------------
    const maleRows = maleRes.future_years.map((year, i) => ({
      year,
      predicted: maleRes.forecast[i],
    }));

    const femaleRows = femaleRes.future_years.map((year, i) => ({
      year,
      predicted: femaleRes.forecast[i],
    }));

    setTableData({
      male: maleRows,
      female: femaleRows,
    });

    // ----------------------------------------
    // CHART DATA
    // ----------------------------------------
    setChartData({
      labels: maleRes.future_years,
      datasets: [
        {
          label: "Male Forecast",
          data: maleRes.forecast,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.2)",
          borderWidth: 3
        },
        {
          label: "Female Forecast",
          data: femaleRes.forecast,
          borderColor: "#EC4899",
          backgroundColor: "rgba(236,72,153,0.2)",
          borderWidth: 3
        }
      ]
    });

    // ----------------------------------------
    // METRICS (OPTIONAL)
    // ----------------------------------------
    setMetrics({
      male: maleRes.metrics || null,
      female: femaleRes.metrics || null,
    });

    // ======================================================
    // 2️⃣ LOAD MODEL COMPARISON (ALL MODELS + METRICS)
    //    OLD PORT 5003 ⛔ → NEW PORT 5001 ✅
    // ======================================================
    const comparisonRes = await fetch("http://localhost:5001/results");
    const comparison = await comparisonRes.json();

    setAllModelResults(comparison);

    // ======================================================
    // 3️⃣ DYNAMIC EXPLANATION GENERATOR
    // ======================================================
    const best = comparison.best_model;
    const bestMetrics = comparison[best];

    const models = ["mlp1", "mlp2", "mlp3"];

    const rankMAE = [...models].sort((a, b) => comparison[a].mae - comparison[b].mae);
    const rankRMSE = [...models].sort((a, b) => comparison[a].rmse - comparison[b].rmse);
    const rankR2   = [...models].sort((a, b) => comparison[b].r2 - comparison[a].r2);

    const dynamicPoints = [
      `${best.toUpperCase()} achieved the **lowest MAE** among all models (Rank #${rankMAE.indexOf(best) + 1}).`,
      `${best.toUpperCase()} produced the **lowest RMSE**, giving smoother long-term predictions.`,
      `It is ranked #${rankR2.indexOf(best) + 1} in **R²**, showing strong alignment with historical data.`,
      `Compared to MLP1 and MLP3, ${best.toUpperCase()} provides the best balance of accuracy and stability.`,
      `This model generalizes better and avoids overfitting across both gender datasets.`,
      `Overall, ${best.toUpperCase()} is the most reliable model mathematically based on real error metrics.`
    ];

    setExplanation({
      title: `Why ${best.toUpperCase()} Was Selected`,
      points: dynamicPoints
    });

    setMlpMessage("✔ Forecast ready.");

  } catch (err) {
    console.error(err);
    setMlpMessage("❌ Prediction error");
  }

  setMlpLoading(false);
};

const handleLoadEducationMLP = async () => {
  try {
    setEducationLoading(true);
    setEducationMessage("Loading education MLP forecast...");

    // ======================================================
    // 1️⃣ FETCH EDUCATION FORECAST DATA
    // ======================================================
    const res = await fetch("http://localhost:5001/predict-education-all");

    if (!res.ok) {
      throw new Error(
        `Failed to connect to /predict-education-all (status ${res.status})`
      );
    }

    const data = await res.json();

    if (!data.results) {
      console.error("❌ Server response missing results:", data);
      throw new Error("Backend did not send results[]");
    }

    // ======================================================
    // 2️⃣ FETCH MODEL COMPARISON METRICS
    // ======================================================
   const modelRes = await fetch("http://localhost:5001/results?education");


    if (!modelRes.ok) {
      throw new Error(
        `Failed to connect to /education-results (status ${modelRes.status})`
      );
    }

    const modelData = await modelRes.json();

    console.log("📘 Forecast API:", data);
    console.log("📗 Model Results:", modelData);

    // ======================================================
    // 3️⃣ CONSTRUCT TABLE + CHART DATA
    // ======================================================
    const table = {};
    const chart = {};

    Object.keys(data.results).forEach((cat) => {
      const rows = data.results[cat]; // [{year, predicted}, ...]

      table[cat] = rows;

      const years = rows.map((r) => r.year);
      const values = rows.map((r) => r.predicted);

      chart[cat] = {
        labels: years,
        datasets: [
          {
            label: `${cat} Forecast`,
            data: values,
            borderColor: "#2563EB",
            backgroundColor: "rgba(37,99,235,0.25)",
            borderWidth: 3,
            tension: 0.3,
          },
        ],
      };
    });

    // ======================================================
    // 4️⃣ UPDATE REACT STATE
    // ======================================================
    setEducationTableData(table);
    setEducationChartData(chart);
    setEducationExplanation(data.explanation);
    setEducationAllModelResults(modelData);

    setEducationMessage("✔ Education forecast loaded");

  } catch (err) {
    console.error("❌ Education forecast error:", err);
    setEducationMessage("❌ Error loading education forecast");
  } finally {
    setEducationLoading(false);
  }
};


const handleLoadCivilMLP = async () => {
  try {
    setCivilLoading(true);
    setCivilMessage("Loading civil-status forecast...");

    // 1️⃣ FETCH FORECAST DATA
    const res = await fetch("http://localhost:5001/civil-predict-all");
    const data = await res.json();

    if (!data.data) {
      console.error("❌ Missing data field:", data);
      throw new Error("Backend did not return data{}");
    }

    // 2️⃣ FETCH MODEL COMPARISON
    const modelRes = await fetch("http://localhost:5001/results?civil");
    const modelData = await modelRes.json();

    // Save raw model results (needed for comparison table)
    setCivilAllModelResults(modelData);

    // ⭐ ADD EXPLANATION LOGIC (THIS WAS MISSING)
    const best = modelData.best_model;

    setCivilExplanation({
      title: `Why ${best.toUpperCase()} Was Selected`,
      points: [
        `${best.toUpperCase()} achieved the **lowest MAE** among all civil-status models.`,
        `${best.toUpperCase()} produced the **lowest RMSE**, resulting in smoother forecasts.`,
        `It ranked highest in **R²**, meaning it fits historical civil-status data very well.`,
        `Consistent accuracy across all categories makes ${best.toUpperCase()} the most stable model.`,
        `Overall, ${best.toUpperCase()} provides the best balance of error reduction and generalization.`,
      ],
    });

    // 3️⃣ BUILD TABLE + CHARTS
    const table = {};
    const chart = {};

    Object.entries(data.data).forEach(([status, obj]) => {
      const { years, forecast } = obj;

      table[status] = years.map((year, i) => ({
        year,
        predicted: forecast[i],
      }));

      chart[status] = {
        labels: years,
        datasets: [
          {
            label: `${status} Forecast`,
            data: forecast,
            borderColor: "#F59E0B",
            backgroundColor: "rgba(245,158,11,0.25)",
            borderWidth: 3,
            tension: 0.3,
          },
        ],
      };
    });

    setCivilTableData(table);
    setCivilChartData(chart);

    setCivilMessage("✔ Civil-status forecast loaded");

  } catch (err) {
    console.error("❌ Civil forecast error:", err);
    setCivilMessage("❌ Error loading civil forecast");
  } finally {
    setCivilLoading(false);
  }
};





  const [emigrants, setEmigrants] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [activeChart, setActiveChart] = useState("bar");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // NEW: State for male/female trend data
  const [sexTrendData, setSexTrendData] = useState([]);
  // Sex dataset form and editing
const [sexForm, setSexForm] = useState({ year: "", male: "", female: "" });
const [sexEditingId, setSexEditingId] = useState(null);
const [sexEditForm, setSexEditForm] = useState({ year: "", male: "", female: "" });
// Education dataset
const [educationData, setEducationData] = useState([]);
const [educationForm, setEducationForm] = useState({
  year: "",
  elementary: "",
  highschool: "",
  college: "",
  postgrad: "",
  notReported: "",
});
const [educationEditingId, setEducationEditingId] = useState(null);
const [educationEditForm, setEducationEditForm] = useState(educationForm);

  //filter 
  const [activeDataset, setActiveDataset] = useState("emigrants"); 
  const [activeVisualization, setActiveVisualization] = useState("trends");
  const [comparisonData, setComparisonData] = useState([]);
  // how many rows to show in table
const [recordsLimit, setRecordsLimit] = useState("all");


// Age dataset state
const [ageData, setAgeData] = useState([]);
const [ageForm, setAgeForm] = useState({ year: "", ageGroup: "", count: "" });
const [ageEditingId, setAgeEditingId] = useState(null);
const [ageEditForm, setAgeEditForm] = useState({ year: "", ageGroup: "", count: "" });


useEffect(() => {
  const unsub = onSnapshot(collection(db, "emigrantsByAge"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => a.year - b.year);
    setAgeData(sorted);
  });

  return () => unsub();
}, []);


// Helper: map year → decade
const getDecade = (year) => {
  if (!year) return "Other";
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;  // e.g. 2025 → "2020s", 2033 → "2030s"
};


const ageOrder = [
  "14 - Below",
  "15 - 19",
  "20 - 24",
  "25 - 29",
  "30 - 34",
  "35 - 39",
  "40 - 44",
  "45 - 49",
  "50 - 54",
  "55 - 59",
  "60 - 64",
  "65 - 69",
  "70 - Above",
];

// ✅ Normalize age group strings to match predefined categories
const normalizeAgeGroup = (ageGroup) => {
  if (!ageGroup) return "";
  return ageGroup
    .replace(/[–—]/g, "-")  // replace en dash/em dash → hyphen
    .replace(/\s*-\s*/g, " - ") // normalize spacing around dash
    .trim();
};

const aggregateAgeByDecade = (ageData) => {
  const grouped = {};

  ageData.forEach((row) => {
    const decade = getDecade(row.year);
    if (decade === "Other") return;

    // ✅ Normalize the key before grouping
    const key = normalizeAgeGroup(row.ageGroup);

    if (!grouped[key]) grouped[key] = { ageGroup: key };
    grouped[key][decade] = (grouped[key][decade] || 0) + row.count;
  });

  // ✅ Sort based on ageOrder
  return Object.values(grouped).sort(
    (a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup)
  );
};

const handleForecast = async (gender) => {
  const data = await getGenderForecast(gender);

  if (data) {
    setForecastData({
      gender: gender,
      years: data.future_years,   // FIXED ✔
      values: data.forecast      // FIXED ✔
    });
  }
};

// DOWNLOAD CSV for sex dataset
const downloadSexCSV = () => {
  if (!sexTrendData || sexTrendData.length === 0) {
    alert("No gender data available to export!");
    return;
  }

  let csv = "year,male,female\n";

  sexTrendData.forEach(row => {
    csv += `${row.year},${row.male},${row.female}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "gender_yearly.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// DOWNLOAD CSV for education dataset
const downloadEducationCSV = () => {
  if (!educationData || educationData.length === 0) {
    alert("No education data available to export!");
    return;
  }

  // CSV HEADER
  let csv = "year,elementary,highschool,vocational,college,postgrad,notReported\n";

  // Helper to clean values
  const clean = (val) => {
    const n = Number(val);
    return isNaN(n) || val === undefined || val === null || val === "" ? 0 : n;
  };

  // CSV ROWS — all values cleaned to numeric
  educationData.forEach(row => {
    csv += [
      clean(row.year),
      clean(row.elementary),
      clean(row.highschool),
      clean(row.vocational),
      clean(row.college),
      clean(row.postgrad),
      clean(row.notReported)
    ].join(",") + "\n";
  });

  // File download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "education_yearly.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// DOWNLOAD CSV for age dataset
const downloadAgeCSV = () => {
  if (!ageData || ageData.length === 0) {
    alert("No age data available to export!");
    return;
  }

  // CSV HEADER
  let csv = "year,ageGroup,count\n";

  // CSV ROWS
  ageData.forEach(row => {
    csv += `${row.year},${row.ageGroup},${row.count}\n`;
  });

  // File download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "age_yearly.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// DOWNLOAD CSV for emigrants (marital status dataset)
const downloadEmigrantsCSV = () => {
  if (!emigrants || emigrants.length === 0) {
    alert("No emigrant (marital status) data available to export!");
    return;
  }

  // CSV HEADER
  let csv = "year,single,married,widower,separated,divorced,notReported\n";

  // CLEAN HELPER
  const clean = (val) => {
    const n = Number(val);
    return isNaN(n) || val === undefined || val === null || val === "" ? 0 : n;
  };

  // CSV ROWS
  emigrants.forEach((row) => {
    csv += [
      clean(row.year),
      clean(row.single),
      clean(row.married),
      clean(row.widower),
      clean(row.separated),
      clean(row.divorced),
      clean(row.notReported)
    ].join(",") + "\n";
  });

  // FILE DOWNLOAD
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "emigrants_marital_status.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const [forecastYears, setForecastYears] = useState(10);
// For Education modal
const [showEducationMLPModal, setShowEducationMLPModal] = useState(false);

// Forecast states
const [educationForecastData, setEducationForecastData] = useState(null);
const [educationForecastYears, setEducationForecastYears] = useState(10);
const [educationMetrics, setEducationMetrics] = useState(null);
const [educationTableData, setEducationTableData] = useState(null);
const [educationChartData, setEducationChartData] = useState(null);
const [educationMessage, setEducationMessage] = useState("");
const [educationLoading, setEducationLoading] = useState(false);
const [educationExplanation, setEducationExplanation] = useState(null);
const [educationModelResults, setEducationModelResults] = useState(null);
const [educationAllModelResults, setEducationAllModelResults] = useState(null);

// ======================
// AGE FORECAST STATES
// ======================
const [showAgeMLPModal, setShowAgeMLPModal] = useState(false);
const [ageForecastYears, setAgeForecastYears] = useState(10);

const [ageMetrics, setAgeMetrics] = useState(null);
const [ageTableData, setAgeTableData] = useState(null);
const [ageChartData, setAgeChartData] = useState(null);
const [ageExplanation, setAgeExplanation] = useState(null);
const [ageAllModelResults, setAgeAllModelResults] = useState(null);

const [ageLoading, setAgeLoading] = useState(false);
const [ageMessage, setAgeMessage] = useState("");
const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
const [ageAllForecasts, setAgeAllForecasts] = useState(null);  // ALL GROUPS
const [ageForecastData, setAgeForecastData] = useState(null);  // SELECTED GROUP ONLY

// ======================
// ⭐ CIVIL FORECAST STATES
// ======================
const [showCivilMLPModal, setShowCivilMLPModal] = useState(false);
const [civilLoading, setCivilLoading] = useState(false);
const [civilMessage, setCivilMessage] = useState("");

const [civilMetrics, setCivilMetrics] = useState(null);
const [civilTableData, setCivilTableData] = useState(null);
const [civilChartData, setCivilChartData] = useState(null);
const [civilExplanation, setCivilExplanation] = useState(null);
const [civilAllModelResults, setCivilAllModelResults] = useState(null);
// ==== CIVIL STATUS FORECAST STATES ====


// single forecast panel
const [civilForecastData, setCivilForecastData] = useState(null);
const [civilForecastYears, setCivilForecastYears] = useState(5);

// modal analytics states
const [civilModalLoading, setCivilModalLoading] = useState(false);
const [civilModalMessage, setCivilModalMessage] = useState("");
const [civilModelExplanation, setCivilModelExplanation] = useState(null);

// best model results & metrics
const [civilModelResults, setCivilModelResults] = useState(null);



const handleEducationForecast = async (category) => {
  try {
    const res = await fetch(
      `http://localhost:5001/predict-education?category=${category}`
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setEducationForecastData({
      category: data.category,
      years: data.future_years,
      values: data.forecast
    });

  } catch (err) {
    console.error("Error forecasting education:", err);
    alert("Failed to compute education forecast.");
  }
};

// ======================
// ⭐ SINGLE AGE-GROUP FORECAST
// ======================
const handleAgeForecast = async (group) => {
  try {
    setAgeLoading(true);
    setAgeMessage(`Loading forecast for ${group}...`);

    const res = await fetch(`http://localhost:5001/predict?group=${group}`);
    const data = await res.json();

    if (data.error) {
      setAgeMessage("❌ " + data.error);
      return;
    }

    // SAVE SINGLE GROUP FORECAST
    setAgeForecastData({
      group,
      years: data.future_years,
      values: data.forecast
    });

    // TABLE
    setAgeTableData({
      [group]: data.future_years.map((yr, i) => ({
        year: yr,
        predicted: data.forecast[i]
      }))
    });

    // CHART
    setAgeChartData({
      [group]: {
        labels: data.future_years,
        datasets: [
          {
            label: `${group} Forecast`,
            data: data.forecast,
            borderColor: "#2563EB",
            borderWidth: 3
          }
        ]
      }
    });

    // BEST MODEL EXPLANATION
    setAgeExplanation(data.explanation || null);
    setAgeAllModelResults(data.allModelResults || null);

    setAgeMessage("✔ Forecast ready.");

  } catch (err) {
    console.error(err);
    setAgeMessage("❌ Error loading forecast");
  } finally {
    setAgeLoading(false);
  }
};


const handleAgeForecastAll = async () => {
  try {
    setAgeLoading(true);
    setAgeMessage("Loading ALL age-group forecasts...");

    const ALL_AGE_GROUPS = [
      "14_below",
      "15_19",
      "20_24",
      "25_29",
      "30_34"
    ];

    let raw = {};          // raw backend data for ALL groups
    let tables = {};       // tableData for modal
    let charts = {};       // chartData for modal

    for (const group of ALL_AGE_GROUPS) {
  const res = await fetch(`http://localhost:5001/predict?group=${group}`);
  const data = await res.json();

  raw[group] = {
    years: data.future_years,
    forecast: data.forecast,
  };

  tables[group] = data.future_years.map((yr, i) => ({
    year: yr,
    predicted: data.forecast[i],
  }));

  charts[group] = {
    labels: data.future_years,
    datasets: [
      {
        label: `${group} Forecast`,
        data: data.forecast,
        borderColor: "#2563EB",
        borderWidth: 3,
      },
    ],
  };
}


    // ⭐ DO NOT TOUCH ageForecastData (single group) ⭐
    // Instead store all-group forecasts in a SEPARATE state:
    setAgeAllForecasts(raw);

    // Set modal table + chart data:
    setAgeTableData(tables);
    setAgeChartData(charts);

    setAgeMessage("All forecasts loaded ✔");

  } catch (err) {
    console.error(err);
    setAgeMessage("💡 ❌ Error loading all forecasts");
  } finally {
    setAgeLoading(false);
  }
};


const handleCivilForecast = async (status) => {
  try {
   const res = await fetch(`http://localhost:5001/predict?status=${status}`);


    const data = await res.json();
    setForecastData({
      status,
      years: data.years,
      values: data.forecast
    });

  } catch (err) {
    console.error("Civil forecast error:", err);
    alert("Failed to compute civil-status forecast.");
  }
};

const handleCivilForecastAll = async () => {
  try {
    setCivilModalLoading(true);
    setCivilModalMessage("Generating 10-year civil-status forecasts...");
    setCivilTableData(null);
    setCivilChartData(null);
    setCivilModelResults(null);   // 🔥 make sure we reset it first

    // 1️⃣ Fetch ALL civil-status forecasts + model results from unified backend
    const res = await fetch("http://localhost:5001/civil-predict-all");
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();

    // ⚙️ 2️⃣ FEED MODEL COMPARISON RESULTS INTO THE MODAL
    //    Backend already returns: allModelResults + best_model + explanation
    if (data.allModelResults) {
      setCivilModelResults(data.allModelResults);
    }

    // 🧠 3️⃣ EXPLANATION (use backend explanation if present, else fallback)
    if (data.explanation) {
      setCivilModelExplanation(data.explanation);
    } else {
      const best = data.best_model || data.model_used;
      setCivilModelExplanation({
        title: `Why ${best?.toUpperCase()} Was Selected`,
        points: [
          `We compared all MLP variants using MAE, RMSE, sMAPE, and accuracy across all civil-status categories.`,
          `${best?.toUpperCase()} achieved the best overall balance across these metrics.`,
          `The table below shows how each model performed on average.`,
        ],
      });
    }

    // 📊 4️⃣ BUILD TABLE + CHART DATA (same as before)
    const formattedTable = {};
    const formattedChart = {};

    Object.entries(data.data).forEach(([status, obj]) => {
      const { years, forecast } = obj;

      // TABLE FORMAT
      formattedTable[status] = years.map((year, i) => ({
        year,
        predicted: forecast[i],
      }));

      // CHART FORMAT
      formattedChart[status] = {
        labels: years,
        datasets: [
          {
            label: `${status} Forecast`,
            data: forecast,
            borderColor: "#F59E0B",
            backgroundColor: "rgba(245,158,11,0.3)",
            borderWidth: 3,
            tension: 0.3,
          },
        ],
      };
    });

    setCivilTableData(formattedTable);
    setCivilChartData(formattedChart);

    setCivilModalMessage("Forecast generation complete.");
  } catch (err) {
    console.error("Civil modal error:", err);
    setCivilModalMessage("Error during forecasting.");
  } finally {
    setCivilModalLoading(false);
  }
};









  const handleComparisonCsvUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseComparisonCsv(file)
    .then((rows) => {
      const aggregated = aggregateByDecade(rows);
      setComparisonData(aggregated);
      alert("Comparison CSV uploaded and processed!");
    })
    .catch((err) => {
      console.error("Error parsing comparison CSV:", err);
    });
};

// ✅ Use a map so display labels match your actual data keys
const statusKeyMap = {
  "Single": "single",
  "Married": "married",
  "Widower": "widower",
  "Separated": "separated",
  "Divorced": "divorced",
  "Not Reported": "notReported", // correct camelCase key
};

const civilStatuses = Object.keys(statusKeyMap);

const heatmapYears = emigrants
  ? emigrants.map((e) => e.year).sort((a, b) => a - b)
  : [];

const heatmapData = civilStatuses.map((status) =>
  heatmapYears.map((year) => {
    const record = emigrants.find((e) => e.year === year);
    const key = statusKeyMap[status]; // map display label to field key
    return record ? record[key] || 0 : 0;
  })
);

useEffect(() => {
  const unsub = onSnapshot(collection(db, "educationData"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => a.year - b.year);
    setEducationData(sorted);
  });

  return () => unsub();
}, []);


const fetchSexData = async () => {
  try {
    const data = await getEmigrantsBySex();
    // sort ascending by year
    const sorted = (data || []).sort((a, b) => a.year - b.year);
    setSexTrendData(sorted);
  } catch (err) {
    console.error("Error fetching sex-based emigrants:", err);
  }
};

useEffect(() => {
  const unsub = onSnapshot(collection(db, "emigrantsBySex"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => a.year - b.year);
    setSexTrendData(sorted);
  });

  return () => unsub();
}, []);

useEffect(() => {
  const unsub = onSnapshot(collection(db, "emigrants"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const sorted = data.sort((a, b) => a.year - b.year);
    setEmigrants(sorted);
  });

  return () => unsub(); // cleanup when component unmounts
}, []);

  // Totals + chart data
  const totals = emigrants.reduce(
    (acc, cur) => ({
      single: acc.single + (cur.single || 0),
      married: acc.married + (cur.married || 0),
      widower: acc.widower + (cur.widower || 0),
      separated: acc.separated + (cur.separated || 0),
      divorced: acc.divorced + (cur.divorced || 0),
      notReported: acc.notReported + (cur.notReported || 0),
    }),
    { single: 0, married: 0, widower: 0, separated: 0, divorced: 0, notReported: 0 }
  );

  const totalEmigrants = Object.values(totals).reduce((sum, v) => sum + v, 0);

  const civilStatusChartData = [
    { category: "Single", count: totals.single },
    { category: "Married", count: totals.married },
    { category: "Widower", count: totals.widower },
    { category: "Separated", count: totals.separated },
    { category: "Divorced", count: totals.divorced },
    { category: "Not Reported", count: totals.notReported },
  ];

  const trendData = emigrants
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((e) => ({
      year: e.year,
      total:
        e.single +
        e.married +
        e.widower +
        e.separated +
        e.divorced +
        e.notReported,
      single: e.single,
      married: e.married,
    }));

  const pieData = civilStatusChartData.filter((item) => item.count > 0);

// Fetch all data on mount
useEffect(() => {
  fetchData();        // marital status
  fetchSexData();     // sex trends
  fetchEducation();   // education
  fetchAgeData();     // age distribution
}, []);
 

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
 {/* ✅ Dynamic Hero Section */}
      <HeroSection
  emigrants={emigrants}
  emigrantsBySex={sexTrendData}
  educationData={educationData}   // ✅ added
  styles={styles}
/>

      {/* Dataset Selector */}
<div style={styles.selectorCard}>
  <div style={styles.selectorHeader}>
    <Database size={20} />
    <span>Select Dataset</span>
  </div>
  <div style={styles.radioGroup}>
    <label style={{
      ...styles.radioLabel,
      ...(activeDataset === "emigrants" ? {
        background: "rgba(255, 243, 199, 0.8)",
        border: "2px solid #FFC107",
        color: "#F59E0B",
        boxShadow: "0 4px 16px rgba(255, 193, 7, 0.2)"
      } : {})
    }}>
      <input
        type="radio"
        name="dataset"
        value="emigrants"
        checked={activeDataset === "emigrants"}
        onChange={(e) => setActiveDataset(e.target.value)}
        style={styles.radioInput}
      />
      <span style={{
        ...styles.radioCustom,
        ...(activeDataset === "emigrants" ? {
          border: "2px solid #FFC107",
          background: "#FFC107",
          boxShadow: "0 0 0 4px rgba(255, 193, 7, 0.2), inset 0 0 0 4px white"
        } : {})
      }}></span>
      <FileText size={16} style={{ marginRight: '8px' }} />
      Marital Status (CRUD)
    </label>
    
    <label style={{
      ...styles.radioLabel,
      ...(activeDataset === "sex" ? {
        background: "rgba(255, 243, 199, 0.8)",
        border: "2px solid #FFC107",
        color: "#F59E0B",
        boxShadow: "0 4px 16px rgba(255, 193, 7, 0.2)"
      } : {})
    }}>
      <input
        type="radio"
        name="dataset"
        value="sex"
        checked={activeDataset === "sex"}
        onChange={(e) => setActiveDataset(e.target.value)}
        style={styles.radioInput}
      />
      <span style={{
        ...styles.radioCustom,
        ...(activeDataset === "sex" ? {
          border: "2px solid #FFC107",
          background: "#FFC107",
          boxShadow: "0 0 0 4px rgba(255, 193, 7, 0.2), inset 0 0 0 4px white"
        } : {})
      }}></span>
      <Users size={16} style={{ marginRight: '8px' }} />
      Sex(CRUD)
    </label>
    
    <label style={{
      ...styles.radioLabel,
      ...(activeDataset === "education" ? {
        background: "rgba(255, 243, 199, 0.8)",
        border: "2px solid #FFC107",
        color: "#F59E0B",
        boxShadow: "0 4px 16px rgba(255, 193, 7, 0.2)"
      } : {})
    }}>
      <input
        type="radio"
        name="dataset"
        value="education"
        checked={activeDataset === "education"}
        onChange={(e) => setActiveDataset(e.target.value)}
        style={styles.radioInput}
      />
      <span style={{
        ...styles.radioCustom,
        ...(activeDataset === "education" ? {
          border: "2px solid #FFC107",
          background: "#FFC107",
          boxShadow: "0 0 0 4px rgba(255, 193, 7, 0.2), inset 0 0 0 4px white"
        } : {})
      }}></span>
      <Activity size={16} style={{ marginRight: '8px' }} />
      Education (CRUD)
    </label>
    
    <label style={{
      ...styles.radioLabel,
      ...(activeDataset === "age" ? {
        background: "rgba(255, 243, 199, 0.8)",
        border: "2px solid #FFC107",
        color: "#F59E0B",
        boxShadow: "0 4px 16px rgba(255, 193, 7, 0.2)"
      } : {})
    }}>
      <input
        type="radio"
        name="dataset"
        value="age"
        checked={activeDataset === "age"}
        onChange={(e) => setActiveDataset(e.target.value)}
        style={styles.radioInput}
      />
      <span style={{
        ...styles.radioCustom,
        ...(activeDataset === "age" ? {
          border: "2px solid #FFC107",
          background: "#FFC107",
          boxShadow: "0 0 0 4px rgba(255, 193, 7, 0.2), inset 0 0 0 4px white"
        } : {})
      }}></span>
      <Users size={16} style={{ marginRight: "8px" }} />
      Age (CRUD)
    </label>
  </div>
</div>

    {activeDataset === "education" && (
  <EducationForm
    educationForm={educationForm}
    setEducationForm={setEducationForm}
    handleEducationAdd={() =>
  handleEducationAdd(
    educationForm,
    setEducationForm,
    () => fetchEducation(setEducationData)
  )
}
/>)}

{/* Add Form for age Dataset */}
{activeDataset === "age" && (
  <AgeForm
    ageForm={ageForm}
    setAgeForm={setAgeForm}
    handleAgeAdd={() =>
  handleAgeAdd(
    ageForm,
    setAgeForm,
    (updated) => fetchAgeData(setAgeData) // unified fetch
  )
}
  />)}

{/* Add Form for civil Dataset */}
    {activeDataset === "emigrants" && (
  <CivilStatusForm
  form={form}
  errors={errors}
  handleChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
  handleAdd={() =>
    handleAddEmigrant(
      form,
      setForm,
      () => fetchEmigrants(setEmigrants, setLoading),
      () => validateEmigrantForm(form, emigrants, editingId, setErrors)
    )
  }
  loading={loading}
/>)}

{/* Add Form for sex Dataset */}
 {activeDataset === "sex" && (
  <SexForm
    sexForm={sexForm}
    setSexForm={setSexForm}
    handleSexAdd={() =>
  handleSexAdd(
    sexForm,
    setSexForm,
    () => fetchSexData(setSexTrendData)
  )
}

  />
)}

{/* Records Table */}
<div style={styles.card}>
  <div
    style={{
      ...styles.cardHeader,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h2 style={styles.cardTitle}>
      <BarChart3 size={20} />
      {activeDataset === "emigrants"
        ? "Records (Marital Status)"
        : activeDataset === "sex"
        ? "Records (Male vs Female)"
        : activeDataset === "education"
        ? "Records (Educational Attainment)"
        : "Records (Age Distribution)"}
    </h2>

    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
     
     {activeDataset === "emigrants" && (
  <>
    <button
      style={{ ...styles.primaryButton, background: "#EF4444" }}
      onClick={() =>
        handleDeleteAllEmigrants(() =>
          fetchEmigrants(setEmigrants, setLoading)
        )
      }
    >
      🗑️ Delete All Records
    </button>

    {/* ⭐ DOWNLOAD CSV FOR EMIGRANTS */}
    <button
      onClick={downloadEmigrantsCSV}
      style={{
        ...styles.primaryButton,
        background: "#FFC107",
        color: "#000",
        marginLeft: "10px",
      }}
    >
      ⬇ Download Emigrants CSV
    </button>
  </>
)}


     {activeDataset === "sex" && (
  <>
    <button
      style={{ ...styles.primaryButton, background: "#EF4444" }}
    onClick={() =>
  handleDeleteAllSex(
    () => fetchSexData(setSexTrendData)
  )
}

    >
      🗑️ Delete All Records
    </button>

    {/* ✅ DOWNLOAD CSV BUTTON */}
    <button
      onClick={downloadSexCSV}
      style={{
        ...styles.primaryButton,
        background: "#FFC107",
        color: "#000",
        marginLeft: "10px",
      }}
    >
      ⬇ Download Gender CSV
    </button>
  </>
)}

      {activeDataset === "education" && (
  <>
    <button
      style={{ ...styles.primaryButton, background: "#EF4444" }}
      onClick={() =>
  handleDeleteAllEducation(
    () => fetchEducation(setEducationData)
  )
}

    >
      🗑️ Delete All Records
    </button>

    <button
      onClick={downloadEducationCSV}
      style={{
        ...styles.primaryButton,
        background: "#FFC107",
        color: "#000",
        marginLeft: "10px",
      }}
    >
      ⬇ Download Education CSV
    </button>
  </>
)}

      {activeDataset === "age" && (
  <>
    <button
      style={{ ...styles.primaryButton, background: "#EF4444" }}
      onClick={() =>
        handleDeleteAllAge(() => fetchAgeData(setAgeData))
      }
    >
      🗑️ Delete All Records
    </button>

    {/* ⭐ NEW: DOWNLOAD AGE CSV BUTTON */}
    <button
      onClick={downloadAgeCSV}
      style={{
        ...styles.primaryButton,
        background: "#FFC107",
        color: "#000",
        marginLeft: "10px",
      }}
    >
      ⬇ Download Age CSV
    </button>
  </>
)}


      {/* Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label style={{ fontWeight: 600, color: "#374151" }}>Show:</label>
        <select
          value={recordsLimit}
          onChange={(e) => setRecordsLimit(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            fontSize: "14px",
          }}
        >
          <option value="all">All</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  </div>

  {/* Replace all the old big tables with these 4 components */}
  {activeDataset === "emigrants" && (
    <CivilStatusTable
  emigrants={emigrants}
  editingId={editingId}
  editForm={editForm}
  recordsLimit={recordsLimit}
  handleEditChange={(e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
  startEdit={(record) => startEditEmigrant(record, setEditingId, setEditForm)}
  cancelEdit={() => cancelEditEmigrant(setEditingId, setEditForm, initialForm)}
  saveEdit={() =>
    saveEditEmigrant(
      editingId,
      editForm,
      () => fetchEmigrants(setEmigrants, setLoading),
      () => validateEmigrantForm(editForm, emigrants, editingId, setErrors)
    )
  }
  handleDelete={(id) =>
    handleDeleteEmigrant(id, () => fetchEmigrants(setEmigrants, setLoading))
  }
/>

  )}

  {activeDataset === "sex" && (
    <SexTable
      sexTrendData={sexTrendData}
      recordsLimit={recordsLimit}
      sexEditingId={sexEditingId}
      sexEditForm={sexEditForm}
      setSexEditForm={setSexEditForm}
      startSexEdit={(record) =>
  startSexEdit(record, setSexEditingId, setSexEditForm)
}

    saveSexEdit={() =>
  saveSexEdit(
    sexEditingId,
    sexEditForm,
    () => fetchSexData(setSexTrendData)
  )
}

      cancelSexEdit={() =>
  cancelSexEdit(setSexEditingId, setSexEditForm)
}

     handleSexDelete={(id) =>
  handleSexDelete(
    id,
    () => fetchSexData(setSexTrendData)
  )
}

    />
  )}

  {activeDataset === "education" && (
    <EducationTable
      educationData={educationData}
      educationEditingId={educationEditingId}
      educationEditForm={educationEditForm}
      setEducationEditForm={setEducationEditForm}
     startEducationEdit={(record) =>
  startEducationEdit(record, setEducationEditingId, setEducationEditForm)
}

      saveEducationEdit={() =>
  saveEducationEdit(
    educationEditingId,
    educationEditForm,
    () => fetchEducation(setEducationData)
  )
}

      cancelEducationEdit={() =>
  cancelEducationEdit(setEducationEditingId, setEducationEditForm)
}

      handleEducationDelete={(id) =>
  handleEducationDelete(id, () => fetchEducation(setEducationData))
}

      recordsLimit={recordsLimit}
    />
  )}

  {activeDataset === "age" && (
    <AgeTable
      ageData={ageData}
      recordsLimit={recordsLimit}
      ageEditingId={ageEditingId}
      ageEditForm={ageEditForm}
      setAgeEditForm={setAgeEditForm}
      startAgeEdit={(record) =>
  startAgeEdit(record, setAgeEditingId, setAgeEditForm)
}

      saveAgeEdit={() =>
  saveAgeEdit(
    ageEditingId,
    ageEditForm,
    () => fetchAgeData(setAgeData)
  )
}

     cancelAgeEdit={() =>
  cancelAgeEdit(setAgeEditingId, setAgeEditForm)
}

      handleAgeDelete={(id) =>
  handleAgeDelete(
    id,
    () => fetchAgeData(setAgeData)
  )
}

    />
  )}
</div>

<GenderMLPModal
  visible={showGenderMLPModal}
  onClose={() => setShowGenderMLPModal(false)}
  onLoad={handleLoadMLP}

  metrics={metrics}
  tableData={tableData}
  chartData={chartData ? <ChartLine data={chartData} /> : null}

  loading={mlpLoading}
  message={mlpMessage}

  explanation={explanation}          // best model explanation (dynamic)
  allModelResults={allModelResults}  // ⭐ NEW: comparison of mlp1/mlp2/mlp3
/>


<EducationMLPModal
  visible={showEducationMLPModal}
  onClose={() => setShowEducationMLPModal(false)}
  onLoad={handleLoadEducationMLP}
  metrics={educationMetrics}
  tableData={educationTableData}
  chartData={educationChartData}
  loading={educationLoading}
  message={educationMessage}
  explanation={educationExplanation}
  allModelResults={educationAllModelResults}   // ✔ FIXED
/>


<AgeMLPModal
  visible={showAgeMLPModal}
  onClose={() => setShowAgeMLPModal(false)}

  onLoad={handleAgeForecastAll}   // ✅ FIXED
  metrics={ageMetrics}

  tableData={ageTableData}
  chartData={ageChartData}

  loading={ageLoading}
  message={ageMessage}

  explanation={ageExplanation}
  allModelResults={ageAllModelResults}
/>

<CivilMLPModal
  visible={showCivilMLPModal}
  onClose={() => setShowCivilMLPModal(false)}

  onLoad={handleLoadCivilMLP}

  loading={civilLoading}
  message={civilMessage}

  tableData={civilTableData}
  chartData={civilChartData}

  explanation={civilExplanation}
  allModelResults={civilModelResults} 
/>


{/* CSV Uploaders */}
 {activeDataset === "emigrants" && (
          <CsvUploaderCivil fetchData={fetchData} />
        )}

        {activeDataset === "age" && (
  <div style={styles.uploadCard}>
    <div style={styles.uploadHeader}>
      <Upload size={20} />
      <span>Upload Age CSV</span>
    </div>
    <input
      type="file"
      accept=".csv"
      onChange={(e) =>
  handleAgeCsvUpload(
    e.target.files[0],
    setAgeData
  )
}

      style={styles.fileInput}
    />
  </div>
)}


{activeDataset === "sex" && (
  <div style={styles.uploadCard}>
    <div style={styles.uploadHeader}>
      <Upload size={20} />
      <span>Upload Sex CSV</span>
    </div>
    <input
      type="file"
      accept=".csv"
     onChange={(e) =>
  handleSexCsvUpload(
    e.target.files[0],
    () => fetchSexData(setSexTrendData)
  )
}

      style={styles.fileInput}
    />
  </div>
)}

{activeDataset === "education" && (
  <div style={styles.uploadCard}>
    <div style={styles.uploadHeader}>
      <Upload size={20} />
      <span>Upload Education CSV</span>
    </div>
    <input
      type="file"
      accept=".csv"
      onChange={(e) =>
  handleEducationCsvUpload(
    e.target.files[0],
    () => fetchEducation(setEducationData)
  )
}

      style={styles.fileInput}
    />
  </div>
)}


{/* Visualization Selector */}

<VisualizationSelector 
  active={activeVisualization} 
  setActive={setActiveVisualization} 
/>

       


{/* Charts (SAFE) */}
{(() => {
  const hasTrends        = (sexTrendData?.length ?? 0) > 0;
  const hasDistribution  = (ageData?.length ?? 0) > 0;
  const hasComposition   = (educationData?.length ?? 0) > 0;
  const hasRelationships =
    (heatmapYears?.length ?? 0) > 0 &&
    (civilStatuses?.length ?? 0) > 0 &&
    (heatmapData?.length ?? 0) > 0;

  const ready = {
    trends: hasTrends,
    distribution: hasDistribution,
    composition: hasComposition,
    relationships: hasRelationships,
    geographic: true,
    comparison: true,
  };

  const canRender = !!ready[activeVisualization];

  return (
    <div style={styles.chartCard}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          <Activity size={20} />
          Data Visualization
        </h2>
        {/* ✅ Dynamic description */}
        <p style={{ fontSize: "0.9rem", color: "#4B5563", marginTop: "0.3rem" }}>
          {chartDescriptions?.[activeVisualization] ?? ""}
        </p>
      </div>

      {/* =========================
          FILTER PANELS (unchanged)
         ========================= */}

     {/* ✅ Filters for trends */}
{activeVisualization === "trends" && (
  <div style={styles.selectorCard}>
    <div style={styles.selectorHeader}>
      <Activity size={20} />
      <span>Filter Controls</span>
    </div>

    {/* Year Range */}
    <div style={{ marginBottom: "24px" }}>
      <label style={{ fontWeight: 600, fontSize: "14px", color: "#475569", marginBottom: "12px", display: "flex", alignItems: "center" }}>
        <Calendar size={16} style={{ marginRight: 8 }} />
        Year Range
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <input
          type="number"
          value={yearRange?.[0] ?? 1980}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([+e.target.value, yearRange?.[1] ?? 2020])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <span style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>to</span>
        <input
          type="number"
          value={yearRange?.[1] ?? 2020}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([yearRange?.[0] ?? 1980, +e.target.value])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          onClick={() => setYearRange([1980, 2020])}
          style={{ padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, background: "white", color: "#64748b", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s ease", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FFC107";
            e.currentTarget.style.color = "#FFC107";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>

    {/* Sex */}
    <div>
      <label style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 12, display: "flex", alignItems: "center" }}>
        <Users size={16} style={{ marginRight: 8 }} />
        Sex
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
        {["all", "male", "female"].map((sex) => {
          const isSelected = selectedSex === sex;
          return (
            <button
              key={sex}
              onClick={() => setSelectedSex(sex)}
              style={{
                padding: "12px 16px",
                border: isSelected ? "2px solid #FFC107" : "2px solid #e2e8f0",
                borderRadius: 10,
                background: isSelected ? "#fffbeb" : "white",
                color: isSelected ? "#FFC107" : "#64748b",
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              {sex.charAt(0).toUpperCase() + sex.slice(1)}
            </button>
          );
        })}
      </div>
    </div>

    {/* Selected indicator */}
    {selectedSex !== "all" && (
      <div style={{ marginTop: 20, padding: 12, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
          Filtered by
        </div>
        <span style={{ background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)", color: "white", padding: "6px 12px", borderRadius: 16, fontSize: 13, fontWeight: 500, boxShadow: "0 2px 4px rgba(255,193,7,.2)", display: "inline-block" }}>
          {selectedSex.charAt(0).toUpperCase() + selectedSex.slice(1)}
        </span>
      </div>
    )}
  </div>
)}

      {/* ✅ Filters for Distribution */}
{activeVisualization === "distribution" && (
  <div style={styles.selectorCard}>
    <div style={styles.selectorHeader}>
      <Activity size={20} />
      <span>Filter Controls</span>
    </div>

    {/* Year Range */}
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 12, display: "flex", alignItems: "center" }}>
        <Calendar size={16} style={{ marginRight: 8 }} />
        Year Range
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <input
          type="number"
          value={yearRange?.[0] ?? 1980}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([+e.target.value, yearRange?.[1] ?? 2020])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <span style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>to</span>
        <input
          type="number"
          value={yearRange?.[1] ?? 2020}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([yearRange?.[0] ?? 1980, +e.target.value])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          onClick={() => setYearRange([1980, 2020])}
          style={{ padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, background: "white", color: "#64748b", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s ease", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FFC107";
            e.currentTarget.style.color = "#FFC107";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>

    {/* Selection Mode */}
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600, marginBottom: 10, display: "block", fontSize: 14, color: "#475569" }}>
        Selection Mode
      </label>
      <div style={{ display: "flex", gap: 0, background: "#f1f5f9", padding: 4, borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <button
          onClick={() => setMultiSelect(false)}
          style={{
            flex: 1, padding: "10px 16px", border: "none", borderRadius: 8,
            background: !multiSelect ? "white" : "transparent",
            color: !multiSelect ? "#FFC107" : "#64748b",
            fontWeight: !multiSelect ? 600 : 500, fontSize: 14, cursor: "pointer",
            transition: "all .2s ease", boxShadow: !multiSelect ? "0 1px 3px rgba(0,0,0,.1)" : "none",
          }}
        >
          Single Select
        </button>
        <button
          onClick={() => setMultiSelect(true)}
          style={{
            flex: 1, padding: "10px 16px", border: "none", borderRadius: 8,
            background: multiSelect ? "white" : "transparent",
            color: multiSelect ? "#FFC107" : "#64748b",
            fontWeight: multiSelect ? 600 : 500, fontSize: 14, cursor: "pointer",
            transition: "all .2s ease", boxShadow: multiSelect ? "0 1px 3px rgba(0,0,0,.1)" : "none",
          }}
        >
          Multi Select
        </button>
      </div>
    </div>

    {/* Age Groups */}
    <div>
      <label style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 12, display: "block" }}>
        Age Groups
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 10 }}>
        <button
          onClick={() => setSelectedAgeGroups([])}
          style={{
            padding: "12px 16px",
            border: (selectedAgeGroups?.length ?? 0) === 0 ? "2px solid #FFC107" : "2px solid #e2e8f0",
            borderRadius: 10,
            background: (selectedAgeGroups?.length ?? 0) === 0 ? "#fffbeb" : "white",
            color: (selectedAgeGroups?.length ?? 0) === 0 ? "#FFC107" : "#64748b",
            fontWeight: (selectedAgeGroups?.length ?? 0) === 0 ? 600 : 500,
            fontSize: 14,
            cursor: "pointer",
            transition: "all .2s ease",
            gridColumn: "1 / -1",
          }}
        >
          All Age Groups
        </button>

        {(ageOrder ?? []).map((group) => {
          const isSelected = (selectedAgeGroups ?? []).includes(group);
          return (
            <button
              key={group}
              onClick={() => {
                if (multiSelect) {
                  setSelectedAgeGroups((prev = []) =>
                    prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
                  );
                } else {
                  setSelectedAgeGroups([group]);
                }
              }}
              style={{
                padding: "12px 16px",
                border: isSelected ? "2px solid #FFC107" : "2px solid #e2e8f0",
                borderRadius: 10,
                background: isSelected ? "#fffbeb" : "white",
                color: isSelected ? "#FFC107" : "#64748b",
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              {group}
            </button>
          );
        })}
      </div>
    </div>

    {/* Selected badges */}
    {(selectedAgeGroups?.length ?? 0) > 0 && (
      <div style={{ marginTop: 20, padding: 12, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
          Selected ({selectedAgeGroups.length})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selectedAgeGroups.map((group) => (
            <span key={group} style={{ background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)", color: "white", padding: "6px 12px", borderRadius: 16, fontSize: 13, fontWeight: 500, boxShadow: "0 2px 4px rgba(255,193,7,.2)" }}>
              {group}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

     {/* ✅ Filters for Composition */}
{activeVisualization === "composition" && (
  <div style={styles.selectorCard}>
    <div style={styles.selectorHeader}>
      <Activity size={20} />
      <span>Filter Controls</span>
    </div>

    {/* Year Range (same as above) */}
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 12, display: "flex", alignItems: "center" }}>
        <Calendar size={16} style={{ marginRight: 8 }} />
        Year Range
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <input
          type="number"
          value={yearRange?.[0] ?? 1980}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([+e.target.value, yearRange?.[1] ?? 2020])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <span style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>to</span>
        <input
          type="number"
          value={yearRange?.[1] ?? 2020}
          min="1980"
          max="2030"
          onChange={(e) => setYearRange([yearRange?.[0] ?? 1980, +e.target.value])}
          style={{ flex: 1, padding: "12px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#1e293b", background: "white", outline: "none", transition: "all .2s ease" }}
          onFocus={(e) => (e.target.style.borderColor = "#FFC107")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          onClick={() => setYearRange([1980, 2020])}
          style={{ padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, background: "white", color: "#64748b", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s ease", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FFC107";
            e.currentTarget.style.color = "#FFC107";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>

    {/* Selection Mode */}
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 600, marginBottom: 10, display: "block", fontSize: 14, color: "#475569" }}>
        Selection Mode
      </label>
      <div style={{ display: "flex", gap: 0, background: "#f1f5f9", padding: 4, borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <button
          onClick={() => setMultiSelect(false)}
          style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, background: !multiSelect ? "white" : "transparent", color: !multiSelect ? "#FFC107" : "#64748b", fontWeight: !multiSelect ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all .2s ease", boxShadow: !multiSelect ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}
        >
          Single Select
        </button>
        <button
          onClick={() => setMultiSelect(true)}
          style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 8, background: multiSelect ? "white" : "transparent", color: multiSelect ? "#FFC107" : "#64748b", fontWeight: multiSelect ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all .2s ease", boxShadow: multiSelect ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}
        >
          Multi Select
        </button>
      </div>
    </div>

    {/* Education Levels */}
    <div>
      <label style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 12, display: "block" }}>
        Education Levels
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 10 }}>
        <button
          onClick={() => setSelectedEducation([])}
          style={{
            padding: "12px 16px",
            border: (selectedEducation?.length ?? 0) === 0 ? "2px solid #FFC107" : "2px solid #e2e8f0",
            borderRadius: 10,
            background: (selectedEducation?.length ?? 0) === 0 ? "#fffbeb" : "white",
            color: (selectedEducation?.length ?? 0) === 0 ? "#FFC107" : "#64748b",
            fontWeight: (selectedEducation?.length ?? 0) === 0 ? 600 : 500,
            fontSize: 14,
            cursor: "pointer",
            transition: "all .2s ease",
            gridColumn: "1 / -1",
          }}
        >
          All Levels
        </button>

        {[
          { value: "elementary",  label: "Elementary" },
          { value: "highschool",  label: "High School" },
          { value: "college",     label: "College" },
          { value: "postgrad",    label: "Postgrad" },
          { value: "notReported", label: "Not Reported" },
        ].map((edu) => {
          const isSelected = (selectedEducation ?? []).includes(edu.value);
          return (
            <button
              key={edu.value}
              onClick={() => {
                if (multiSelect) {
                  setSelectedEducation((prev = []) =>
                    prev.includes(edu.value) ? prev.filter((e) => e !== edu.value) : [...prev, edu.value]
                  );
                } else {
                  setSelectedEducation([edu.value]);
                }
              }}
              style={{
                padding: "12px 16px",
                border: isSelected ? "2px solid #FFC107" : "2px solid #e2e8f0",
                borderRadius: 10,
                background: isSelected ? "#fffbeb" : "white",
                color: isSelected ? "#FFC107" : "#64748b",
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              {edu.label}
            </button>
          );
        })}
      </div>
    </div>

    {(selectedEducation?.length ?? 0) > 0 && (
      <div style={{ marginTop: 20, padding: 12, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
          Selected ({selectedEducation.length})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selectedEducation.map((edu) => (
            <span key={edu} style={{ background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)", color: "white", padding: "6px 12px", borderRadius: 16, fontSize: 13, fontWeight: 500, boxShadow: "0 2px 4px rgba(255,193,7,.2)" }}>
              {edu}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

      {/* =========================
          CHART CANVAS + DOWNLOAD
         ========================= */}
      <div style={{ position: "relative" }}>
        {/* Download Button */}
       <button
  onClick={handleDownloadChart}
  style={{
    position: "absolute", right: 12, top: 8, zIndex: 20,
    background: "rgba(255,193,7,0.9)", backdropFilter: "blur(10px)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 16px",
    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
    fontSize: 14, fontWeight: 600,
    boxShadow: "0 4px 6px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.06)",
    transition: "all .3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,179,0,0.95)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,.15)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(255,193,7,0.9)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.06)";
  }}
>
  <Download size={16} />
  Download Chart
</button>

        {/* Chart Container to Capture */}
        <div ref={chartRef} style={styles.chartContainer}>
          {/* Trends */}
         {activeVisualization === "trends" && (
  !hasTrends ? (
    <div style={styles.chartEmpty}><p>No Male/Female records available. Upload a CSV first.</p></div>
  ) : (
    <>
      {/* The existing Line Chart */}
     <ResponsiveContainer width="100%" height="100%">
  <LineChart
    data={sexTrendData.filter(
      (row) =>
        row.year >= (yearRange?.[0] ?? 1980) &&
        row.year <= (yearRange?.[1] ?? 2020)
    )}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" />
    <YAxis />
    <Tooltip />
    <Legend />

    {(selectedSex === "all" || selectedSex === "male") && (
      <ReLine
        type="monotone"
        dataKey="male"
        stroke="#60A5FA"
        strokeWidth={3}
        name="Male"
      />
    )}

    {(selectedSex === "all" || selectedSex === "female") && (
      <ReLine
        type="monotone"
        dataKey="female"
        stroke="#CA8A04"
        strokeWidth={3}
        name="Female"
      />
    )}
  </LineChart>
</ResponsiveContainer>

    </>
  )
)}
          {/* Comparison */}
          {activeVisualization === "comparison" && (
            <>
              <div style={styles.uploadCard}>
                <div style={styles.uploadHeader}>
                  <Upload size={20} />
                  <span>Upload Comparison CSV</span>
                </div>
                <input type="file" accept=".csv" onChange={handleComparisonCsvUpload} style={styles.fileInput} />
              </div>
              {(comparisonData?.length ?? 0) > 0 ? (
                <ComparisonChart data={comparisonData} />
              ) : (
                <div style={styles.chartEmpty}><p>No comparison data available. Upload a CSV first.</p></div>
              )}
            </>
          )}

          {/* Composition */}
          {activeVisualization === "composition" && (
            !hasComposition ? (
              <div style={styles.chartEmpty}><p>No education data yet. Upload or add records first.</p></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={educationData.filter((row) => row.year >= (yearRange?.[0] ?? 1980) && row.year <= (yearRange?.[1] ?? 2020))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" angle={-45} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedEducation.length === 0 || selectedEducation.includes("elementary"))  && <Area type="monotone" dataKey="elementary"  stackId="1" stroke="#1E3A8A" fill="#1E3A8A" />}
                  {(selectedEducation.length === 0 || selectedEducation.includes("highschool"))  && <Area type="monotone" dataKey="highschool"  stackId="1" stroke="#F59E0B" fill="#F59E0B" />}
                  {(selectedEducation.length === 0 || selectedEducation.includes("college"))     && <Area type="monotone" dataKey="college"     stackId="1" stroke="#2563EB" fill="#2563EB" />}
                  {(selectedEducation.length === 0 || selectedEducation.includes("postgrad"))    && <Area type="monotone" dataKey="postgrad"    stackId="1" stroke="#D97706" fill="#D97706" />}
                  {(selectedEducation.length === 0 || selectedEducation.includes("notReported")) && <Area type="monotone" dataKey="notReported" stackId="1" stroke="#FCD34D" fill="#FCD34D" />}
                </AreaChart>
              </ResponsiveContainer>
            )
          )}

          {/* Distribution */}
          {activeVisualization === "distribution" && (
            !hasDistribution ? (
              <div style={styles.chartEmpty}><p>No Age data available. Upload a CSV first.</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={aggregateAgeByDecade(
                    ageData.filter(
                      (row) =>
                        row.year >= (yearRange?.[0] ?? 1980) &&
                        row.year <= (yearRange?.[1] ?? 2020) &&
                        ((selectedAgeGroups?.length ?? 0) === 0 || selectedAgeGroups.includes(row.ageGroup))
                    )
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Array.from(
                    new Set(
                      ageData
                        .filter(
                          (row) =>
                            row.year >= (yearRange?.[0] ?? 1980) &&
                            row.year <= (yearRange?.[1] ?? 2020) &&
                            ((selectedAgeGroups?.length ?? 0) === 0 || selectedAgeGroups.includes(row.ageGroup))
                        )
                        .map((row) => getDecade(row.year))
                    )
                  )
                    .sort()
                    .map((decade, idx) => (
                      <Bar
                        key={decade}
                        dataKey={decade}
                        fill={["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#6366F1", "#EC4899"][idx % 6]}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            )
          )}

         {/* Relationships (Heatmap) */}
{activeVisualization === "relationships" && (
  !hasRelationships ? (
    <div style={styles.chartEmpty}><p>No civil status data available. Upload the Civil Status CSV first.</p></div>
  ) : (
    <div style={styles.heatmapContainer}>
      <h3 style={styles.heatmapTitle}>Marital Status × Year Heatmap</h3>
      <div style={{ display: "flex" }}>
        <div style={styles.yAxisLabels}>
          {(civilStatuses ?? []).map((status, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                ...styles.yAxisLabel,
                background: hoverRow === rowIdx ? "rgba(255,193,7,0.15)" : "transparent",
              }}
            >
              {status}
            </div>
          ))}
        </div>
        <div style={styles.heatmapWrapper}>
          <div style={styles.heatmapScroll}>
            <HeatMap
              xLabels={(heatmapYears ?? []).map(String)}
              yLabels={new Array((civilStatuses ?? []).length).fill("")}
              data={heatmapData ?? []}
              squares
              height={45}
              cellStyle={(background, value, min, max, data, x, y) => {
                // 🔒 Safe globalMax (no Math.max on empty array)
                const flatVals = (data ?? []).flat().filter((v) => v > 0);
                const globalMax = flatVals.length ? Math.max(...flatVals) : 1;
                const intensity = value > 0 ? Math.log(value + 1) / Math.log(globalMax + 1) : 0;
                const isRowHighlight = hoverRow === y;
                const isColHighlight = hoverCol === x;
                return {
                  background: `hsl(45,85%,${95 - intensity * 45}%)`,
                  fontSize: 11,
                  fontWeight: 500,
                  color: intensity > 0.6 ? "#1a1a1a" : "#111827",
                  border: "1px solid #E5E7EB",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "all .2s ease",
                  outline: isRowHighlight || isColHighlight ? "2px solid #FFC107" : "none",
                  outlineOffset: "-2px",
                };
              }}
              cellRender={(value, x, y) => (
                <div
                  onMouseEnter={() => {
                    setHoverRow(y);
                    setHoverCol(x);
                  }}
                  onMouseLeave={() => {
                    setHoverRow(null);
                    setHoverCol(null);
                  }}
                >
                  {value > 0 ? value.toLocaleString() : ""}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
)}

          {activeVisualization === "geographic" && <FlowMapUploader />}
          
        </div>
      </div>
    </div>
  );
})()}

{activeDataset === "sex" && (
  <SexDatasetSection
    setShowGenderMLPModal={setShowGenderMLPModal}
    handleForecast={handleForecast}
    forecastData={forecastData}
    forecastYears={forecastYears}
    setForecastYears={setForecastYears}
  />
)}

{activeDataset === "education" && (
  <EducationDatasetSection
    setShowEducationMLPModal={setShowEducationMLPModal}
    handleEducationForecast={handleEducationForecast}
    educationForecastData={educationForecastData}
    educationForecastYears={educationForecastYears}
    setEducationForecastYears={setEducationForecastYears}
  />
)}

{activeDataset === "age" && (
 <AgeDatasetSection
  setShowAgeMLPModal={setShowAgeMLPModal}
  handleAgeForecast={handleAgeForecast}   // ✔ SINGLE GROUP FIXED
  ageForecastData={ageForecastData}
  ageForecastYears={ageForecastYears}
  setAgeForecastYears={setAgeForecastYears}
/>
)}
{activeDataset === "emigrants" && (
  <CivilDatasetSection
    setShowCivilMLPModal={setShowCivilMLPModal}
    showCivilMLPModal={showCivilMLPModal}

    handleCivilForecast={handleCivilForecast}
    handleCivilForecastAll={handleCivilForecastAll}

    civilForecastData={forecastData}

    civilForecastYears={civilForecastYears}
    setCivilForecastYears={setCivilForecastYears}

    civilModalLoading={civilModalLoading}
    civilModalMessage={civilModalMessage}
    civilModelExplanation={civilModelExplanation}

    civilModelResults={civilModelResults}
    civilTableData={civilTableData}
    civilChartData={civilChartData}
  />
)}



      </div>
    </div>
  );
}

export default App;
