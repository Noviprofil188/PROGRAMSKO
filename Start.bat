@echo off
echo =============================
echo Pokretanje TreningApp aplikacije
echo =============================

:: Backend
echo [1/4] Instalacija backend paketa...
cd TreningApp\Backend
npm install

echo [2/4] Pokretanje backend servera...
start cmd /k "cd TreningApp\Backend && node Indeks.js"

:: Frontend
cd ..\Frontend\quasar-project
echo [3/4] Instalacija frontend paketa...
npm install

echo [4/4] Pokretanje Quasar frontenda...
start cmd /k "cd TreningApp\Frontend\quasar-project && quasar dev"

echo =============================
echo Gotovo. Backend i frontend su pokrenuti.
echo =============================
pause
