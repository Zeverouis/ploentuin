Welkom bij de Ploentuin frontend! Alvorens je start, lees deze README.  

Ploentuin is dé web applicatie voor (moes)tuinders. Hierin is
een database/bibliotheek (infopages), een forum en een tuinplanner
in verwerkt.

In de bibliotheek kan men informatie over planten en aanverwante
zaken vinden en kunnen admins nieuwe pagina's en categorieën aanmaken.

Op het forum kan men tips en tricks delen (wel eerst even verifieëren),
admin/mods posts/comments verwijderen en gebruikers verbannen.

Met de planner kan men de (moes)tuin inrichten, opslaan (mits ingelogd)
en exporteren als pdf/word/excel/png.

Gebruikte technieken zijn React 19 (Vite), Axios, React-Toastify, React Router,
jwt-decode, ESLint.

De frontend is modulair opgebouwd om onderhoud en herbruikbaarheid te
bevorderen. Assets - Components - Pages met gebruik van context en hooks.

<br/>Voor het correct werken van de frontend is de backend ook belangrijk dus alvorens je de frontend cloned en opstart, graag eerst de backend doen.  
<br/>**Intellij:**  
<br/>Java versie: 17  
<br/>Clone de repo.  
Laad maven in.  
Maak een postgresql database aan genaamd Ploentuin  
Vul je eigen username en password in bij die velden in de application.properties.  
Klik op de groene pijl.  
Mogelijk is het nodig om de net aangemaakte database te refreshen (in pgAdmin of iets dergelijks)  
<br/>spring.datasource.url=jdbc:postgresql://localhost:5432/Ploentuin 🡨 belangrijk!  
spring.datasource.username={username}  
spring.datasource.password={password}  
<br/>De tabellen worden automatisch aangemaakt (en ook ge-refreshed bij heropstart).

<br/>Nu dat uit de weg is, kan de frontend opgestart worden.  
<br/><br/><br/>**Webstorm:**

De backend draait op <http://localhost:8080>  
Node versie: 22.14  
<br/>Nadat de backend draait, clone je de repo.  
Installeer de benodigde bibliotheken met npm install.  
Start de applicatie met npm run dev.  
Klik de link.  
Veel plezier!  
<br/><br/>Pre-seeded usernames: alice, defaultadmin, bob (is mod), charlie, diana, edward  
Wachtwoord voor alle users: Password123  
<br/>Er zijn specifieke admin/mod functies en voor sommige forum specifieke functies moet het email geverifieerd zijn (wat al zo is bij de pre-seeded users). Hou hier rekening mee.  
**  
<br/>**
