# Practical Workflow: Android Reverse Engineering & Analysis

This workflow outlines the systematic process of decompiling and analyzing an Android application to understand its architecture, logic, and data flow.

## 1. Decompile with JADX → View Java Code
*   **Tool:** [jadx-gui](https://github.com/skylot/jadx)
*   **Action:** Open the APK/AAB file in JADX.
*   **Goal:** Convert Dalvik bytecode (DEX) back into readable Java source code. 
*   **Pro Tip:** Use JADX's "Save as Gradle project" for complex apps to leverage IDE features like "Go to Definition" in VS Code or IntelliJ.

## 2. Read `AndroidManifest.xml` → Understand Main Architecture
*   **File:** Located in the root of the decompiled project.
*   **Key Items to Identify:**
    *   **Package Name:** The unique identifier of the app.
    *   **Permissions:** Identify sensitive data/features the app accesses (e.g., `INTERNET`, `READ_CONTACTS`, `CAMERA`).
    *   **Components:** List of all Activities, Services, Broadcast Receivers, and Content Providers.
    *   **Main Launcher:** Search for the Activity containing the `<intent-filter>` with `android.intent.action.MAIN` and `android.intent.category.LAUNCHER`.

## 3. Find `MainActivity` → Entry Point
*   **Action:** Locate the Java class corresponding to the main launcher activity identified in the manifest.
*   **Analysis:** Focus on the `onCreate()` method. This is typically where the app:
    *   Initializes UI components.
    *   Sets up dependency injection (Dagger, Hilt, Koin).
    *   Triggers initial data fetching or checks authentication status.

## 4. Search API Keys/Domains → Understand Backend Flow
*   **Action:** Perform a global search (Ctrl+Shift+F in JADX) for:
    *   Protocols: `http://`, `https://`
    *   Keywords: `api_key`, `secret`, `token`, `v1/`, `v2/`, `endpoint`.
    *   Cloud Services: `firebaseio.com`, `amazonaws.com`, `googleapis.com`.
*   **Goal:** Map the backend infrastructure and identify external SDKs (Analytics, Ads, Crashlytics).

## 5. Monitor Intent/Activity → Draw User Flow Diagram
*   **Tools:** `adb logcat`, `pidcat`.
*   **Action:** Monitor the device logs while interacting with the app.
    *   Command: `adb shell dumpsys activity activities | grep mResumedActivity`
*   **Goal:** Track screen transitions and see how data is bundled and passed between Activities via `Intent` extras.

## 6. Analyze Database/Network Code → Understand Data Flow
*   **Database Analysis:**
    *   Search for classes implementing `RoomDatabase`, `SQLiteOpenHelper`, or `RealmObject`.
    *   Check `/data/data/[package_name]/databases/` on a rooted device or emulator.
*   **Network Analysis:**
    *   Look for `Retrofit` interfaces or `OkHttpClient` configurations.
    *   Search for custom `Interceptors` which often handle authentication headers or logging.
*   **Goal:** Understand the local schema and the data models used for syncing with the server.

---
*Created for the Workflow Management System*
