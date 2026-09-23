use crate::state::AppState;
use crate::models::JobStatus;
use std::process::Command;
use std::env;

pub async fn run_analysis_task(state: AppState, job_id: String, filepath: String) {
    state.update_status(&job_id, JobStatus::Parsing).await;
    
    let python_bin = env::var("PYTHON_BIN").unwrap_or_else(|_| "python".into());
    let script_dir = env::var("PYTHON_SCRIPT_DIR").unwrap_or_else(|_| "../python-analysis".into());
    let results_dir = env::var("RESULTS_DIR").unwrap_or_else(|_| "../data/results".into());
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    state.update_status(&job_id, JobStatus::Preprocessing).await;
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    state.update_status(&job_id, JobStatus::Detecting).await;
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    state.update_status(&job_id, JobStatus::Analyzing).await;
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    state.update_status(&job_id, JobStatus::Extracting).await;
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    state.update_status(&job_id, JobStatus::Classifying).await;
    
    // `filepath` (e.g. "../data/uploads/xxx.wav") is already relative to the backend's
    // own working directory. Since `python-analysis/` is a sibling of `backend/` (both
    // one level under the project root), the same relative path resolves correctly from
    // the python script's working directory too — no extra "../" prefix is needed here.
    // (Adding one, as before, walked one directory too far up and made every upload fail
    // with "Input file not found".)
    let output = Command::new(&python_bin)
        .current_dir(&script_dir)
        .arg("app.py")
        .arg("--input")
        .arg(&filepath)
        .arg("--output-dir")
        .arg(&results_dir)
        .arg("--job-id")
        .arg(&job_id)
        .output();
        
    match output {
        Ok(out) => {
            if out.status.success() {
                let stdout = String::from_utf8_lossy(&out.stdout);
                
                let mut last_json: Option<serde_json::Value> = None;
                for line in stdout.lines() {
                    if let Ok(v) = serde_json::from_str(line) {
                        last_json = Some(v);
                    }
                }
                
                if let Some(json_val) = last_json {
                    if let Some(result_file) = json_val.get("result_file").and_then(|v| v.as_str()) {
                        state.update_status(&job_id, JobStatus::GeneratingReport).await;
                        
                        tokio::time::sleep(std::time::Duration::from_millis(500)).await;
                        
                        // the result_file is likely relative to the script dir, so we adjust
                        let actual_result_file = format!("{}/{}", script_dir, result_file);
                        
                        if let Ok(result_content) = tokio::fs::read_to_string(&actual_result_file).await {
                            if let Ok(result_json) = serde_json::from_str(&result_content) {
                                state.set_result(&job_id, result_json).await;
                            } else {
                                state.set_error(&job_id, "Invalid result JSON format".into()).await;
                            }
                        } else {
                            state.set_error(&job_id, format!("Could not read result file: {}", actual_result_file)).await;
                        }
                    } else if let Some(err) = json_val.get("error").and_then(|v| v.as_str()) {
                        state.set_error(&job_id, err.to_string()).await;
                    } else {
                        state.set_error(&job_id, "Python script returned success but no result_file".into()).await;
                    }
                } else {
                    state.set_error(&job_id, "Failed to parse Python output".into()).await;
                }
                
            } else {
                // app.py reports errors as JSON on stdout (with a non-zero exit code),
                // and only unhandled crashes land on stderr, so check stdout first.
                let stdout = String::from_utf8_lossy(&out.stdout);
                let stderr = String::from_utf8_lossy(&out.stderr);

                let stdout_error = stdout.lines().rev().find_map(|line| {
                    serde_json::from_str::<serde_json::Value>(line)
                        .ok()
                        .and_then(|v| v.get("error").and_then(|e| e.as_str()).map(String::from))
                });

                let message = stdout_error.unwrap_or_else(|| {
                    if stderr.trim().is_empty() {
                        format!("Python script exited with an error (no output captured). stdout: {}", stdout)
                    } else {
                        format!("Python execution failed: {}", stderr)
                    }
                });
                state.set_error(&job_id, message).await;
            }
        },
        Err(e) => {
            state.set_error(&job_id, format!("Failed to spawn Python process: {}", e)).await;
        }
    }
}
