// code partially taken from
// www.youtube.com/watch?v=g4U5WRzHitM&t=976s
// developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
// (access 03.05.2020)
function openDatabase() {
    if (!window.indexedDB) {
        alert("indexedDB not supported");
    }
    const request = window.indexedDB.open("ScoreDatabase", 1);
    request.onupgradeneeded = function (e) {
        console.log("in upgrade");
        const db = request.result;
        const store = db.createObjectStore("ScoreStore", { autoIncrement: true });
        const index = store.createIndex("score", "score", { unique: false });
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
                const row = "<tr>"
                    + "<td>" + cursor.value.score + "</td>"
                    + "</tr>";
                console.log("row: " + row);
                bestScoresTableBodyEl.innerHTML += row;
                cursor.continue();
            }
        };
    };
}
