use std::{fs, path::PathBuf};

fn portable_directory() -> Result<PathBuf, String> {
    if let Ok(appimage) = std::env::var("APPIMAGE") {
        if let Some(parent) = PathBuf::from(appimage).parent() {
            return Ok(parent.to_path_buf());
        }
    }

    let executable = std::env::current_exe().map_err(|e| e.to_string())?;
    #[cfg(target_os = "macos")]
    {
        for ancestor in executable.ancestors() {
            if ancestor.extension().and_then(|x| x.to_str()) == Some("app") {
                return ancestor.parent().map(PathBuf::from).ok_or_else(|| "No se encontró el directorio portable".to_string());
            }
        }
    }

    executable.parent().map(PathBuf::from).ok_or_else(|| "No se encontró el directorio de Studium".to_string())
}

fn data_file() -> Result<PathBuf, String> {
    Ok(portable_directory()?.join("Studium-data.json"))
}

#[tauri::command]
fn load_portable_data() -> Result<String, String> {
    let path = data_file()?;
    match fs::read_to_string(path) {
        Ok(data) => Ok(data),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
fn save_portable_data(data: String) -> Result<(), String> {
    serde_json::from_str::<serde_json::Value>(&data).map_err(|e| format!("Datos JSON inválidos: {e}"))?;
    let path = data_file()?;
    let temporary = path.with_extension("json.tmp");
    fs::write(&temporary, data).map_err(|e| e.to_string())?;
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    fs::rename(temporary, path).map_err(|e| e.to_string())
}

#[tauri::command]
fn portable_data_path() -> Result<String, String> {
    data_file().map(|path| path.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_portable_data, save_portable_data, portable_data_path])
        .run(tauri::generate_context!())
        .expect("error al iniciar Studium");
}
