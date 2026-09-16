# Scouter

Web aplikacija za prijavu djece u izviđačku udrugu i na događaje koje udruga organizira.

## O projektu

- **Tim:** Leon Radola
- **Ustanova:** [Fakultet informatike u Puli](https://fipu.unipu.hr)
- **Kolegij:** [Programsko inženjerstvo](https://ntankovic.unipu.hr/pi)
- **Mentor:** [doc. dr. sc. Nikola Tanković](https://ntankovic.unipu.hr)

## Kratki opis

Scouter digitalizira prijavu djece u izviđačku udrugu i njihovu prijavu na
događaje. Zamjenjuje papirnate prijavnice, ručno prepisivanje podataka i
neorganizirane popise po porukama i Excel tablicama.

Sustav ima dvije skupine korisnika: roditelje i administratora udruge.

### Roditelj

- Prijavljuje dijete u udrugu i unosi njegove podatke (OIB, datum rođenja,
  adresa, alergije, lijekovi, posebne potrebe)
- Pregledava dostupne događaje s brojem slobodnih mjesta
- Prijavljuje jedno ili više djece iz iste obitelji na događaj
- Daje roditeljsku suglasnost pri prijavi
- Pregledava vlastite prijave i prima potvrdu prijave na e-mail

### Administrator

- Dodaje, uređuje i briše događaje te ograničava maksimalan broj sudionika
- Odobrava ili odbija prijave (na čekanju / odobreno / odbijeno)
- Filtrira djecu po dobi ili skupini
- Pregledava arhivu prošlih događaja
- Preuzima popis sudionika u obliku Excel ili Google Sheets tablice

LINK: https://scauter.netlify.app/

Dijete se može prijaviti na događaj samo ako je prethodno prijavljeno kao
član udruge. Sustav tu provjeru izvodi prije spremanja svake prijave.
