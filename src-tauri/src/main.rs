#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]

#[cfg(target_os = "windows")]
fn detach_from_console() {
    use std::ffi::c_void;

    #[link(name = "kernel32")]
    unsafe extern "system" {
        fn GetConsoleWindow() -> *mut c_void;
        fn FreeConsole() -> i32;
    }

    // El subsistema GUI evita crear una consola; esto desconecta cualquier
    // consola heredada por launchers o ejecución desde una terminal.
    unsafe {
        if !GetConsoleWindow().is_null() {
            let _ = FreeConsole();
        }
    }
}

fn main() {
    #[cfg(target_os = "windows")]
    detach_from_console();

    studium_lib::run();
}
