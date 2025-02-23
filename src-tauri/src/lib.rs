use std::{collections::HashMap, sync::Mutex};

use lazy_static::lazy_static;
use tauri::{Emitter, Manager, Window};

lazy_static! {
    static ref EXECUTE_ONCE_EVENT_MAP: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

#[tauri::command]
fn execute_once(window: Window, event_name: &str) -> Result<bool, String> {
    let mut execute_once_event_map = EXECUTE_ONCE_EVENT_MAP.lock().unwrap();
    let key = event_name.to_string();
    if execute_once_event_map.contains_key(&key) {
        return Ok(false);
    }
    execute_once_event_map.insert(key, event_name.to_string());
    window.emit("execute-once", event_name).unwrap();
    Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        // .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, __, ___| {
            app.get_webview_window("main").unwrap().show().unwrap();
        }))
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_pinia::init())
        .invoke_handler(tauri::generate_handler![execute_once])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
