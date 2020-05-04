function openDatabase() {
    if (!window.indexedDB) {
        alert("indexedDB not supported");
    }
    let request = window.indexedDB.open("ScoreDatabase", 1);
    request.onupgradeneeded = function (e) {
        console.log("in upgrade");
        let db = request.result;
        let store = db.createObjectStore("ScoreStore", { autoIncrement: true });
        let index = store.createIndex("score", "score", { unique: false });
    };
    request.onerror = function (e) {
        console.log("Error while opening DB");
    };
    return request;
}
export function addToDatabase(quizScore, quizStatistics) {
    const request = openDatabase();
    request.onsuccess = function (e) {
        const db = request.result;
        const tx = db.transaction("ScoreStore", "readwrite");
        const store = tx.objectStore("ScoreStore");
        const index = store.index("score");
        db.onerror = function (e) {
            console.log("Error while using database");
        };
        store.put({ score: quizScore, statistics: quizStatistics });
        tx.oncomplete = function () {
            db.close();
        };
    };
}
// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/index
export function diplayDataByIndex(bestScoresTableBodyEl) {
    const request = openDatabase();
    request.onsuccess = function (e) {
        const db = request.result;
        const tx = db.transaction("ScoreStore", 'readonly');
        const store = tx.objectStore("ScoreStore");
        const index = store.index("score");
        let i = 0;
        bestScoresTableBodyEl.innerHTML = "";
        index.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor && i < 5) {
                console.log("i: " + i);
                i++;
                let row = "<tr>"
                    + "<td>" + cursor.value.score + "</td>"
                    + "</tr>";
                console.log("row: " + row);
                bestScoresTableBodyEl.innerHTML += row;
                cursor.continue();
            }
        };
        if (i === 0) {
            bestScoresTableBodyEl.innerHTML = " - ";
        }
    };
}
