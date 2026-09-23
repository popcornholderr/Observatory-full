use serde_json::Value;

/// Flattens the sections of an analysis result that are useful in a spreadsheet
/// (metadata, detection, parameters, classification) into "section,field,value" CSV rows.
/// Nested objects/arrays are rendered as compact JSON so nothing is silently dropped.
pub fn result_to_csv(result: &Value) -> String {
    let mut out = String::from("section,field,value\n");

    let sections = ["metadata", "detection", "parameters", "classification"];
    for section in sections {
        if let Some(obj) = result.get(section).and_then(|v| v.as_object()) {
            for (key, value) in obj {
                out.push_str(&csv_escape(section));
                out.push(',');
                out.push_str(&csv_escape(key));
                out.push(',');
                out.push_str(&csv_escape(&value_to_string(value)));
                out.push('\n');
            }
        }
    }

    out
}

fn value_to_string(value: &Value) -> String {
    match value {
        Value::String(s) => s.clone(),
        Value::Null => String::new(),
        other => other.to_string(),
    }
}

fn csv_escape(field: &str) -> String {
    if field.contains(',') || field.contains('"') || field.contains('\n') {
        format!("\"{}\"", field.replace('"', "\"\""))
    } else {
        field.to_string()
    }
}
