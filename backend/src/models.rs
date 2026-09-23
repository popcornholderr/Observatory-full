use serde::{Deserialize, Serialize};

// The frontend matches statuses against SCREAMING_SNAKE_CASE strings (e.g. "GENERATING_REPORT").
// Without this, serde's default PascalCase serialization ("GeneratingReport") silently
// fails to match, and that pipeline stage never highlights correctly in the UI.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum JobStatus {
    Queued,
    Parsing,
    Preprocessing,
    Detecting,
    Analyzing,
    Extracting,
    Classifying,
    GeneratingReport,
    Completed,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnalysisJob {
    pub id: String,
    pub filename: String,
    pub status: JobStatus,
    pub result: Option<serde_json::Value>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct StatusResponse {
    pub id: String,
    pub status: JobStatus,
    pub error: Option<String>,
}
