// setEmailVerified.js

// Hole das Admin SDK
const admin = require('firebase-admin');

// Wichtig: Ersetze 'serviceAccountKey.json' durch den Pfad ZU deiner heruntergeladenen Datei
// Wenn die Datei im selben Verzeichnis liegt, reicht der Dateiname
const serviceAccount = require('./serviceAccountKey.json');

// Initialisiere das Admin SDK
// Stelle sicher, dass du die anderen Initialisierungsoptionen (wie databaseURL) hinzufügst,
// falls du andere Firebase Produkte mit dem Admin SDK nutzen möchtest.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Falls du auch RTDB nutzt, füge dies hinzu (ersetze mit deiner URL):
    // databaseURL: "https://projectslackclone-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log('Firebase Admin SDK initialisiert.');

// *** Hier kommt der Code zur Aktualisierung des Benutzers ***

// 1. Finde die UID des Benutzers in der Firebase Console -> Authentication
const uidDesZuAktualisierendenBenutzers = 'TRAGE_HIER_DIE_TATSÄCHLICHE_UID_EIN'; // <--- GANZ WICHTIG: ERSETZE DIESEN PLATZHALTER!

// Überprüfe, ob der Platzhalter ersetzt wurde
if (uidDesZuAktualisierendenBenutzers === 'TRAGE_HIER_DIE_TATSÄCHLICHE_UID_EIN') {
    console.error("FEHLER: Du musst die UID des Benutzers in der Datei setEmailVerified.js ersetzen!");
    process.exit(1); // Beendet das Skript mit einem Fehlercode
}


console.log(`Versuche, den Benutzer mit UID: ${uidDesZuAktualisierendenBenutzers} als verifiziert zu markieren...`);

// Aktualisiere den Benutzer
admin.auth().updateUser(uidDesZuAktualisierendenBenutzers, {
    emailVerified: true // Setze den Status auf true
})
    .then(() => {
        console.log('✨ Erfolgreich! Der Benutzer ist jetzt als "E-Mail verifiziert" markiert.');
        process.exit(0); // Beendet das Skript erfolgreich
    })
    .catch((error) => {
        console.error('❌ Fehler beim Aktualisieren des Benutzers:', error);
        process.exit(1); // Beendet das Skript mit einem Fehlercode
    });

// Das Skript wird hier nicht sofort beendet, da updateUser asynchron ist.
// Die process.exit() Aufrufe in .then() und .catch() beenden das Skript, sobald die Operation abgeschlossen ist.
